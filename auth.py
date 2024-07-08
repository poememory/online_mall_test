# auth.py
from functools import wraps
from flask import request, jsonify
from passlib.hash import sha256_crypt
from datetime import datetime, timedelta
import jwt
import random
import string
from db import get_db_connection
from config import Config
from email_utils import send_verification_email

users_db = {}


def generate_verification_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            current_user = data['email']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def get_verification_code(data):
    email = data.get('email')
    verification_code = generate_verification_code()
    if send_verification_email(email, verification_code):
        users_db[email] = verification_code
        return jsonify({'message': 'Verification code sent successfully'}), 200
    else:
        return jsonify({'message': 'Failed to send verification code. Please try again later.'}), 500


def register(data):
    email = data.get('email')
    verification_code = data.get('verification_code')
    password = data.get('password')

    # 检查验证码是否正确
    if email in users_db and users_db[email] == verification_code:
        try:
            connection = get_db_connection()
            if not connection:
                return jsonify({'message': 'Database connection error'}), 500

            cursor = connection.cursor()
            cursor.execute('SELECT * FROM user_account WHERE email = %s', (email,))
            user = cursor.fetchone()

            if user:
                return jsonify({'message': 'Email already registered'}), 409

            hashed_password = sha256_crypt.hash(password)

            cursor.execute('SELECT MAX(user_id) FROM user_account')
            max_user_id = cursor.fetchone()[0]
            new_user_id = int(max_user_id) + 1 if max_user_id else 1

            cursor.execute('INSERT INTO user_account (user_id, email, password) VALUES (%s, %s, %s)',
                           (new_user_id, email, hashed_password))
            connection.commit()

            return jsonify({'message': 'User registered successfully'}), 200

        except Error as e:
            return jsonify({'message': 'Error registering user', 'error': str(e)}), 500

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
                del users_db[email]  # 清除验证码
    else:
        return jsonify({'message': 'Invalid verification code. Please try again.'}), 401

def login(data):
    email = data.get('email')
    password = data.get('password')
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM user_account WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        if user and sha256_crypt.verify(password, user[2]):
            token_payload = {
                'email': email,
                'exp': datetime.utcnow() + timedelta(hours=48)
            }
            token = jwt.encode(token_payload, Config.JWT_SECRET_KEY, algorithm='HS256')
            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Error as e:
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500


def profile(user_email):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM user_account WHERE email = %s', (user_email,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            user_info = {
                'email': user[1],
                'gender': user[3],
                'phone': user[4],
                'detail':user[5],
                'name':user[7]
            }
            return jsonify(user_info), 200
        else:
            return jsonify({'message': 'User not found'}), 404

    except Error as e:
        return jsonify({'message': 'Error fetching user profile', 'error': str(e)}), 500

def update_profile(data):
    try:
        # 获取请求中的更新信息
        update_data = data

        # 解析要更新的用户信息
        name = update_data.get('name')
        user_email = update_data.get('email')
        gender = update_data.get('gender')
        phone = update_data.get('phone')
        detail = update_data.get('detail')

        # 连接数据库
        connection = get_db_connection()
        cursor = connection.cursor()

        # 执行更新操作
        cursor.execute('UPDATE user_account SET name = %s, gender = %s, phone = %s, detail = %s WHERE email = %s',
                       (name,gender, phone, detail, user_email))
        connection.commit()

        # 关闭数据库连接
        cursor.close()
        connection.close()

        return jsonify({'message': 'User profile updated successfully'}), 200

    except Exception as e:
        return jsonify({'message': 'Error updating user profile', 'error': str(e)}), 500