from flask import Flask, request, jsonify, make_response
from config import Config
from auth import get_verification_code, register, login, token_required ,profile,update_profile
from flask_cors import CORS
from product import homedetail, product_detail, productKind

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.before_request
def handle_options_request():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS,GET")
        return response


@app.route('/api/get_verification_code', methods=['POST'])
def get_verification_code_route():
    return get_verification_code(request.json)


@app.route('/api/register', methods=['POST'])
def register_route():
    return register(request.json)


@app.route('/api/login', methods=['POST'])
def login_route():
    return login(request.json)


@app.route('/api/profile', methods=['GET'])
@token_required
def profile_route(current_user):
    return profile(current_user)

@app.route('/api/profile/update', methods=['POST'])
@token_required
def update_profile_route(current_user):
    return update_profile(request.json)

@app.route('/api/homedetail', methods=['POST'])
def homedetail_route():
    return homedetail(request.json)

@app.route('/api/product_detail', methods=['POST'])
def product_detail_route():
    return product_detail(request.json)

@app.route('/api/productKind', methods=['POST'])
def productKind_route():
    return productKind(request.json)

if __name__ == '__main__':
    app.run(debug=True)
