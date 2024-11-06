# AirlineReservation

# Angular Project with Dockerized Frontend and Backend

This project contains an my first ever Angular frontend. With a backend consisting of a Flask Server and a PostgreSQL database. Both of which are dockerized for easier setup and deployment. The backend is based on Flask, and connects to a PostgreSQL database. This project was tested both on windows and mac to ensure that it works as expected.

## Prerequisites

Make sure you have the following installed: (Downloading Docker Desktop is Recommended)

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/QuinThompson/AirlineReservation.git
cd AirlineReservation
```

### 2. Start the Docker Containers

```bash
docker-compose build
```
This will build the Docker images for the frontend and backend.


### 3. Start the Containers

```bash
docker-compose up -d
```

This will start the frontend and backend containers. The frontend will be available at `http://localhost:4200` and the backend will be available at `http://localhost:3003`.



# Project Details

## Assumptions and Constraints

- All flights are one-way/round and do not have layovers.
- A person can book for one or more person(s) per flight.
- Credit Card information is not stored in the system.
- Credit Card follows:
    - 16 Digit format. 
    - 3 Digit Security Code.
    - 4 Digit Expiration Date with format MM/YY.

## Changing Flight Data

To change flight data, you can modify the `flights_data.json` file in the `backend/data` directory. This file contains an array of flight objects, each with the following properties:
- `flight_number`: A unique identifier for the flight.
- `origin`: The origin airport code.
- `destination`: The destination airport code.
- `departure_date`: The departure date in the format `YYYY-MM-DD`.
- `departure_time`: The departure time in the format `HH:MM:SS`.   
- `arrival_date`: The arrival date in the format `YYYY-MM-DD`.
- `arrival_time`: The arrival time in the format `HH:MM:SS`.
- `duration`: The duration of the flight in minutes.
- `capacity`: The maximum number of passengers that can be booked for this flight.
- `price`: The price of the flight per seat.

## Adding or Removing Flights

To add or remove flights, you can modify the `flights_data.json` file as described above. 
Once complete stop the containers using `docker-compose down` and restart the containers using `docker-compose up -d` to apply the changes.

