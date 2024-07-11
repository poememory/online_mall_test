from flask import Flask, request, jsonify, make_response

from cart import get_cart, cart_add, remove_from_cart
from config import Config
from auth import get_verification_code, register, login, token_required ,profile,update_profile
from flask_cors import CORS

from db import get_db_connection
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


@app.route('/api/cart', methods=['GET'])
@token_required
def cart_route(current_user):
    return get_cart(current_user)

@app.route('/api/cart/add', methods=['POST'])
@token_required
def cart_add_route(current_user):
    return cart_add(current_user,request.json)


@app.route('/api/cart/remove', methods=['POST'])
@token_required
def cart_remove_route(current_user):
    return remove_from_cart(current_user,request.json)

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    table_names =['phone', 'laptop','tablet','displayer','camera','earwears','keyboard','mouse']  # 需要依次搜索的表名列表
    columns = ['Taobao_ID', 'Image_URL', 'Name', 'Price','P_ID']  # 指定的列名
    all_results = []

    for table_name in table_names:
        columns_str = ', '.join(columns)
        search_query = f"SELECT {columns_str} FROM {table_name} WHERE Name LIKE %s OR Name LIKE %s ORDER BY Taobao_ID"
        params = ('%' + query + '%', '%' + query + '%')
        cursor.execute(search_query, params)
        results = cursor.fetchall()
        all_results.extend(results)

    # 检查并过滤重复的PID
    pid_counts = {}
    for row in all_results:
        pid = row['P_ID']
        if pid in pid_counts:
            pid_counts[pid] += 1
        else:
            pid_counts[pid] = 1

    filtered_results = []
    seen_pids = set()
    for row in all_results:
        pid = row['P_ID']
        if pid_counts[pid] > 1 and pid not in seen_pids:
            seen_pids.add(pid)
            filtered_results.append(row)

    conn.close()
    return jsonify(filtered_results)

if __name__ == '__main__':
    app.run(debug=True)
