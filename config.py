# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'exexex'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+mysqlconnector://root:QAZwsx822633@localhost/shopping'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'exexex'
