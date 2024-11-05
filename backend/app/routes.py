# from flask import request, jsonify, Blueprint
# from . import db
# from .flight_model import Flight
# from datetime import datetime

# from flask import request, jsonify, Blueprint
# from . import db
# from .flight_model import Flight
# from .booking_model import Booking
# from .passenger_model import Passenger
# import random
# import string

from flask import request, jsonify, Blueprint
from . import db
from .flight_model import Flight
from .booking_model import Booking
from .passenger_model import Passenger
# from .booking_bridge_model import Booking_Bridge
from .booking_bridge import Booking_Bridge
import random
import string
from datetime import datetime


routes = Blueprint('routes', __name__)

@routes.route('/api/flights', methods=['GET'])
def get_all_flights():
    flights = Flight.query.all() 
    flights_data = [
        {
            "id": flight.id,
            "flight_number": flight.flight_number,
            "origin": flight.origin,
            "destination": flight.destination,
            "departure_time": flight.departure_time.isoformat(),
            "arrival_time": flight.arrival_time.isoformat(),
            "seats_available": flight.seats_available,
            "flight_price": flight.flight_price,
            "duration": flight.duration
        } for flight in flights
    ]
    return jsonify(flights_data)


@routes.route('/api/flights/search', methods=['POST'])
def search_flights():
    data = request.get_json()

    from_country = data.get('from_country')
    to_country = data.get('to_country')
    guests = data.get('guests')
    depart_date = data.get('departDate')
    return_date = data.get('returnDate')

    depart_date = datetime.strptime(depart_date, "%Y-%m-%d") if depart_date else None
    return_date = datetime.strptime(return_date, "%Y-%m-%d") if return_date else None

    flights = get_flights(from_country, to_country, guests, depart_date, return_date)
    return jsonify(flights)

def get_flights(from_country, to_country, guests, depart_date, return_date):
    query = Flight.query.filter(
        Flight.origin == from_country,
        Flight.destination == to_country,
        Flight.seats_available >= guests
    )
    # Add departure date to the query if provided
    if depart_date:
        query = query.filter(Flight.departure_date == depart_date)

    # Add return date filter if provided
    if return_date:
        query = query.filter(Flight.arrival_date == return_date)

    flights = query.all()
    if not flights:
        print("No flights found matching criteria.")

    # Return flight details as JSON-compatible dictionaries
    return [
        {
            "flight_number": flight.flight_number,
            "origin": flight.origin,
            "destination": flight.destination,
            "departure_date": flight.departure_date,
            "return_date": flight.arrival_date,
            "departure_time": flight.departure_time.strftime("%H:%M:%S") if flight.departure_time else None,
            "arrival_time": flight.arrival_time.strftime("%H:%M:%S") if flight.arrival_time else None,
            "seats_available": flight.seats_available,
            "guests": guests,
            "flight_price": flight.flight_price,
            'duration': flight.duration,
            "id": flight.id,
        }
        for flight in flights
    ]


def generate_booking_reference():
    """Generate a unique booking reference number"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def get_or_create_passenger(passenger_data):
    """Check if a passenger exists, and create a new one if not"""
    existing_passenger = Passenger.query.filter_by(
        first_name=passenger_data.get("first_name"),
        last_name=passenger_data.get("last_name"),
        passport_number=passenger_data.get("passport_number")
    ).first()

    if existing_passenger:
        return existing_passenger
    
    # Create a new passenger if none found
    new_passenger = Passenger(
        first_name=passenger_data.get("firstName"),
        last_name=passenger_data.get("lastName"),
        email=passenger_data.get("email"),
        phone_number=passenger_data.get("phone"),
        date_of_birth=passenger_data.get("dob"),
        gender=passenger_data.get("gender"),
        passport_number=passenger_data.get("passportNumber")
    )
    db.session.add(new_passenger)
    db.session.flush()  # Ensure ID is generated for the new passenger
    return new_passenger



@routes.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    flight_id = data.get("flight_id")
    passengers_data = data.get("passengers", [])

    # return jsonify(data)

    get_flight = Flight.query.filter_by(
        flight_number=flight_id.get("flight_number"),
    ).first()

    if not flight_id or not passengers_data:
        return jsonify({"error": "Flight ID and passengers data are required"}), 400

    # Generate a unique booking reference
    booking_reference = generate_booking_reference()
    
    # Create a booking record
    new_booking = Booking(booking_reference_number=booking_reference)
    db.session.add(new_booking)
    db.session.flush()  # Ensure ID is generated for FK relationships

    # Process each passenger and add records to the bridge table
    for passenger_data in passengers_data:
        # Get or create the passenger
        passenger = get_or_create_passenger(passenger_data)
        
        # Link the booking, passenger, and flight in the bridge table
        booking_link = Booking_Bridge(
            booking_reference_number=new_booking.id,  # Link to booking ID
            flight_id=get_flight.id,
            passenger_id=passenger.id
        )
        db.session.add(booking_link)

    # Commit all changes to the database
    db.session.commit()

    return jsonify({"message": "Booking created successfully", "booking_reference": booking_reference, "flight_id": flight_id, "passengers": passengers_data}), 201



@routes.route('/api/bookings/<string:booking_reference>', methods=['GET'])
def get_booking(booking_reference):
    # return jsonify({"message": "Booking details not implemented yet"}), 501
    # Find the booking by reference number
    booking = Booking.query.filter_by(booking_reference_number=booking_reference).first()


    if booking is None:
        return jsonify({'message': 'Booking not found'}), 200

    # If booking is found, get associated details from the Booking_Bridge
    booking_details = Booking_Bridge.query.filter_by(booking_reference_number=booking.id).all()


    # Prepare the response data
    response_data = []
    for detail in booking_details:
        passenger = Passenger.query.get(detail.passenger_id)
        flight_details = Flight.query.get(detail.flight_id)

        response_data.append({
            'booking_reference': booking.booking_reference_number,
            'flight_id': {
                'flight_number' : flight_details.flight_number,
                'origin' : flight_details.origin,
                'destination' : flight_details.destination,
                'departure_date': flight_details.departure_date.strftime('%Y-%m-%d'),
            },
            'passenger': {
                'first_name': passenger.first_name,
                'last_name': passenger.last_name,
                'email': passenger.email,
                'phone_number': passenger.phone_number,
            },
            'created_at': detail.created_at,
            'updated_at': detail.updated_at,
        })

    return jsonify(response_data), 200

    # def generate_booking_reference():
    #     return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

    # @routes.route('/api/bookings', methods=['POST'])
    # def create_booking():
    #     data = request.get_json()

    #     # Passenger data
    #     passenger_data = data.get('passenger')
    #     flight_id = data.get('flight_id')

    #     if not passenger_data or not flight_id:
    #         return jsonify({"error": "Passenger data and flight ID are required"}), 400

    #     # Step 1: Create a new Passenger
    #     new_passenger = Passenger(
    #         first_name=passenger_data.get('first_name'),
    #         last_name=passenger_data.get('last_name'),
    #         email=passenger_data.get('email'),
    #         phone_number=passenger_data.get('phone_number'),
    #         date_of_birth=datetime.strptime(passenger_data.get('date_of_birth'), '%Y-%m-%d'),
    #         gender=passenger_data.get('gender'),
    #         passport_number=passenger_data.get('passport_number')
    #     )
    #     db.session.add(new_passenger)
    #     db.session.commit()  # Commit to get the new passenger ID

    #     # Step 2: Create a new Booking with the passenger ID
    #     new_booking = Booking(
    #         booking_reference_number=generate_booking_reference(),
    #         flight_id=flight_id,
    #         passenger_id=new_passenger.id  # Link the booking to the new passenger
    #     )
    #     db.session.add(new_booking)
    #     db.session.commit()

    #     return jsonify({
    #         "booking_reference_number": new_booking.booking_reference_number,
    #         "flight_id": new_booking.flight_id,
    #         "passenger_id": new_booking.passenger_id,
    #         "created_at": new_booking.created_at,
    #         "passenger": {
    #             "first_name": new_passenger.first_name,
    #             "last_name": new_passenger.last_name,
    #             "email": new_passenger.email,
    #             "phone_number": new_passenger.phone_number,
    #             "date_of_birth": new_passenger.date_of_birth.strftime('%Y-%m-%d'),
    #             "gender": new_passenger.gender,
    #             "passport_number": new_passenger.passport_number
    #         }
    #     }), 201