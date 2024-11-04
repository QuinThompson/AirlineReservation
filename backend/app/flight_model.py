from .extensions import db

class Flight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    flight_number = db.Column(db.String(10), unique=True, nullable=False)
    origin = db.Column(db.String(50), nullable=False)
    destination = db.Column(db.String(50), nullable=False)
    departure_date = db.Column(db.Date, nullable=False) 
    departure_time = db.Column(db.Time, nullable=False)  
    arrival_time = db.Column(db.Time, nullable=False)   
    seats_available = db.Column(db.Integer, nullable=False)
    flight_price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.String(50), nullable=False)
