# from app import create_app
# from __init__ import create_app  # Updated path for create_app
from app.__init__ import create_app  # Updated path for create_app


app = create_app()  # Call the application factory to create the app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
