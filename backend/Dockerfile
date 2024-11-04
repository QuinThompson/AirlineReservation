# Use an official Python runtime as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the Flask app code into the container
COPY . .

# Expose the port on which Flask will run
EXPOSE 5000

# Run the Flask application
CMD ["python", "run.py"]
