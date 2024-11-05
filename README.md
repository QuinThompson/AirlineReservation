# AirlineReservation

# Angular Project with Dockerized Frontend and Backend

This project contains an Angular frontend and a backend service, both of which are dockerized for easier setup and deployment. The backend is based on Flask, and connects to a PostgreSQL database.

## Prerequisites

Make sure you have the following installed:

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
docker-compose up
```

This will start the frontend and backend containers. The frontend will be available at `http://localhost:4200` and the backend will be available at `http://localhost:3003`.