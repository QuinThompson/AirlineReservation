from flask import request, jsonify, Blueprint
from . import db
from .flight_model import Flight
from .booking_model import Booking
from .passenger_model import Passenger
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
    if depart_date:
        query = query.filter(Flight.departure_date == depart_date)
    if return_date:
        query = query.filter(Flight.arrival_date == return_date)
    flights = query.all()
    if not flights:
        print("No flights found matching criteria.")
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
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def get_or_create_passenger(passenger_data):
    existing_passenger = Passenger.query.filter_by(
        first_name=passenger_data.get("first_name"),
        last_name=passenger_data.get("last_name"),
        passport_number=passenger_data.get("passport_number")
    ).first()
    if existing_passenger:
        return existing_passenger
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
    db.session.flush()
    return new_passenger

@routes.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    flight_id = data.get("flight_id")
    passengers_data = data.get("passengers", [])
    get_flight = Flight.query.filter_by(
        flight_number=flight_id.get("flight_number"),
    ).first()
    if not flight_id or not passengers_data:
        return jsonify({"error": "Flight ID and passengers data are required"}), 400
    booking_reference = generate_booking_reference()
    new_booking = Booking(booking_reference_number=booking_reference)
    db.session.add(new_booking)
    db.session.flush()
    for passenger_data in passengers_data:
        passenger = get_or_create_passenger(passenger_data)
        booking_link = Booking_Bridge(
            booking_reference_number=new_booking.id,
            flight_id=get_flight.id,
            passenger_id=passenger.id
        )
        db.session.add(booking_link)
    db.session.commit()
    return jsonify({"message": "Booking created successfully", "booking_reference": booking_reference, "flight_id": flight_id, "passengers": passengers_data}), 201

@routes.route('/api/bookings/<string:booking_reference>', methods=['GET'])
def get_booking(booking_reference):
    booking = Booking.query.filter_by(booking_reference_number=booking_reference).first()
    if booking is None:
        return jsonify({'message': 'Booking not found'}), 200
    booking_details = Booking_Bridge.query.filter_by(booking_reference_number=booking.id).all()
    response_data = []
    for detail in booking_details:
        passenger = Passenger.query.get(detail.passenger_id)
        flight_details = Flight.query.get(detail.flight_id)
        response_data.append({
            'booking_reference': booking.booking_reference_number,
            'flight_id': {
                'flight_number': flight_details.flight_number,
                'origin': flight_details.origin,
                'destination': flight_details.destination,
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
