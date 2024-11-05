from .extensions import db

class Booking_Bridge(db.Model):

    __tablename__ = 'booking_bridge'

    id = db.Column(db.Integer, primary_key=True)
    # booking_reference_number = db.Column(db.String(100),  db.ForeignKey('booking_table.id'), nullable=False)
    booking_reference_number = db.Column(db.Integer, db.ForeignKey('booking_table.id'), nullable=False)
    flight_id = db.Column(db.Integer, db.ForeignKey('flight_table.id'), nullable=False)
    passenger_id = db.Column(db.Integer, db.ForeignKey('passenger_table.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


