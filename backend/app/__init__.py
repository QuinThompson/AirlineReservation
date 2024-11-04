from flask import Flask
from flask_cors import CORS
from .flight_model import db, Flight  # Ensure db is imported from flight_model
import os
import json
from .routes import routes  # Import your routes
from datetime import datetime, timedelta

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(routes)  # Register the Blueprint
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@db:5432/mydatabase'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)  # Initialize SQLAlchemy with the app

    with app.app_context():  # Ensure we're within an app context
        db.drop_all()  
        db.create_all()  # This will create tables if they don't exist
        populate_flights()  # Populate table only if it's empty

    return app

def populate_flights():
    # Check if data already exists in the table
    # if Flight.query.count() == 0:
    json_file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'flights_data.json')
    
    with open(json_file_path, 'r') as file:
        flights_data = json.load(file)
        for flight in flights_data:
            departure_time = datetime.strptime(flight['departure_time'], "%H:%M:%S")
            arrival_time = datetime.strptime(flight['arrival_time'], "%H:%M:%S")
            
            # Calculate duration in hours and minutes
            duration_delta = arrival_time - departure_time
            if duration_delta.days < 0:
                # Handle overnight flights by adding a day to arrival time
                duration_delta = (arrival_time + timedelta(days=1)) - departure_time
                
            hours, remainder = divmod(duration_delta.seconds, 3600)
            minutes = remainder // 60
            duration_str = f"{hours}H {minutes:02}M"
            
            new_flight = Flight(
                flight_number=flight['flight_number'],
                origin=flight['origin'],
                destination=flight['destination'],
                departure_date=flight['departure_date'],
                departure_time=flight['departure_time'],
                arrival_time=flight['arrival_time'],
                seats_available=flight['seats_available'],
                flight_price=flight.get('flight_price', 0),
                duration=duration_str
            )
            db.session.add(new_flight)
        db.session.commit()  # Commit the session to save changes
