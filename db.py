# db.py
import mysql.connector
from mysql.connector import Error
from config import Config
from urllib.parse import urlparse

def get_db_connection():
    try:
        db_url = urlparse(Config.SQLALCHEMY_DATABASE_URI)
        connection = mysql.connector.connect(
            host=db_url.hostname,
            user=db_url.username,
            password=db_url.password,
            database=db_url.path[1:]  # Extracts the database name from the path
        )
        if connection.is_connected():
            print("Connected to MySQL Server version ", connection.get_server_info())
            return connection
    except Error as e:
        print("Error while connecting to MySQL", e)
    return None
