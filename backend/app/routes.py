from flask import request, jsonify, Blueprint
from . import db
from .flight_model import Flight
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
    return_date = data.get('return_date')

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
        query = query.filter(Flight.return_date <= return_date)

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
            "departure_time": flight.departure_time.strftime("%H:%M:%S") if flight.departure_time else None,
            "arrival_time": flight.arrival_time.strftime("%H:%M:%S") if flight.arrival_time else None,
            "seats_available": flight.seats_available,
            "guests": guests,
            "flight_price": flight.flight_price,
            'duration': flight.duration
        }
        for flight in flights
    ]