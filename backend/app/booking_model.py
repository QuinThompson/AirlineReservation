from .extensions import db

class Booking(db.Model):
    __tablename__ = 'booking_table'

    id = db.Column(db.Integer, primary_key=True)
    booking_reference_number = db.Column(db.String(10), unique=True, nullable=False)
    # flight_id = db.Column(db.Integer, db.ForeignKey('flight.id'), nullable=False)
    # passenger_id = db.Column(db.Integer, db.ForeignKey('passenger.id'), nullable=False)
    # passenger_id = db.Column(db.Integer, db.ForeignKey('passenger.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


