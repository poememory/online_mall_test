from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import jwt
from functools import wraps
from passlib.hash import sha256_crypt
from datetime import datetime, timedelta
import random
import string
import mysql.connector
from mysql.connector import Error
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
import smtplib

app = Flask(__name__)

# 连接 MySQL 数据库
try:
    connection = mysql.connector.connect(
        host='localhost',
        database='shopping',  # 替换为你的数据库名
        user='root',          # 替换为你的数据库用户名
        password='QAZwsx822633'   # 替换为你的数据库密码
    )

    if connection.is_connected():
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = connection.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)

except Error as e:
    print("Error while connecting to MySQL", e)

# JWT密钥，可以自行更改为更复杂的密钥
app.config['JWT_SECRET_KEY'] = 'exexex'

# CORS配置
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# 生成随机验证码
def generate_verification_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# 发送邮件函数
def send_verification_email(receiver_email, verification_code):
    sender_email = '3269187297@qq.com'  # 发件人邮箱，替换为你的邮箱地址
    subject = '邮箱验证码'  # 邮件主题
    message = f'欢迎使用全员鄂人数码电商平台，您的验证码是：{verification_code}'  # 邮件内容

    # 创建邮件内容
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = Header(subject, 'utf-8')

    # 邮件正文
    msg.attach(MIMEText(message, 'plain', 'utf-8'))

    try:
        smtp_server = 'smtp.qq.com'  # SMTP服务器地址，这里使用QQ的SMTP服务器
        smtp_port = 587  # SMTP服务器端口号

        # 登录SMTP服务器
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # 开启安全传输模式
        server.login(sender_email, 'awfuphkxsrdccijh')  # 使用发件人邮箱账号和密码登录

        # 发送邮件
        server.sendmail(sender_email, receiver_email, msg.as_string())

        print("邮件发送成功")
        return True

    except smtplib.SMTPException as e:
        print(f"邮件发送失败: {e}")
        return False

    except Exception as e:
        print(f"发生异常: {e}")
        return False

    finally:
        # 尝试关闭连接
        try:
            server.quit()
        except Exception as e:
            pass  # 如果连接未成功初始化，可能会在这里引发 UnboundLocalError


users_db = {}

# 处理 OPTIONS 请求
@app.before_request
def handle_options_request():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response

# 获取验证码接口
@app.route('/api/get_verification_code', methods=['POST'])
def get_verification_code():
    data = request.json
    email = data.get('email')

    # 生成验证码
    verification_code = generate_verification_code()

    # 发送邮件
    if send_verification_email(email, verification_code):
        # 存储验证码（这里简化为存储在内存中）
        users_db[email] = verification_code

        return jsonify({'message': 'Verification code sent successfully'}), 200
    else:
        return jsonify({'message': 'Failed to send verification code. Please try again later.'}), 500

# 注册接口
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    verification_code = data.get('verification_code')
    password = data.get('password')

    # 检查验证码是否正确
    if email in users_db and users_db[email] == verification_code:
        # 查询数据库中是否存在该邮箱
        try:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM user_account WHERE email = %s', (email,))
            user = cursor.fetchone()

            if user:
                cursor.close()
                return jsonify({'message': 'Email already registered'}), 409

            # 生成密码哈希
            hashed_password = sha256_crypt.hash(password)

            # 生成一个新的 user_id
            cursor.execute('SELECT MAX(user_id) FROM user_account')
            max_user_id = cursor.fetchone()[0]
            new_user_id = max_user_id + 1 if max_user_id else 1

            # 存储用户信息到数据库
            cursor.execute('INSERT INTO user_account (user_id, email, password) VALUES (%s, %s, %s)', (new_user_id, email, hashed_password))
            connection.commit()
            cursor.close()

            # 清除验证码
            del users_db[email]

            return jsonify({'message': 'User registered successfully'}), 200

        except Error as e:
            return jsonify({'message': 'Error registering user', 'error': str(e)}), 500

    else:
        return jsonify({'message': 'Invalid verification code. Please try again.'}), 401

# 登录接口
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # 查询数据库中的用户信息
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM user_account WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()

        if user and sha256_crypt.verify(password, user[2]):  # 假设密码字段在第三列
            # 生成JWT token
            token_payload = {
                'email': email,
                'exp': datetime.utcnow() + timedelta(hours=48)  # 设置token过期时间，这里设置为1小时
            }
            token = jwt.encode(token_payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')

            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    except Error as e:
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = data['email']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# 受保护的路由示例
@app.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({'message': f'Welcome {current_user}! This is a protected route.'})


if __name__ == '__main__':
    app.run(debug=True)

