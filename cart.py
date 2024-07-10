import mysql
from flask import jsonify
import json
from db import get_db_connection


def get_cart(user_email):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT carts FROM user_account WHERE email = %s", (user_email,))
        result = cursor.fetchone()
        if result is None:
            return jsonify({'message': 'User not found'}), 404
        current_cart = result['carts']
        if current_cart:
            cart = json.loads(current_cart)
        else:
            cart = []

        return jsonify({'cart': cart}), 200

    except mysql.connector.Error as err:
        return jsonify({'message': 'Error fetching cart', 'error': str(err)}), 500

    finally:
        cursor.close()
        connection.close()


def cart_add(user_email, data):
    user_id = user_email
    product_id = data.get('P_ID')

    if not user_id or not product_id:
        return jsonify({'message': 'user_id and product_id are required'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 获取当前用户的购物车
        cursor.execute("SELECT carts FROM user_account WHERE email = %s", (user_id,))
        result = cursor.fetchone()
        if result is None:
            return jsonify({'message': 'User not found'}), 404

        current_cart = result['carts']
        if current_cart:
            cart = json.loads(current_cart)
        else:
            cart = []

        # 检查商品是否已经在购物车中
        if product_id in cart:
            return jsonify({'message': 'Product already in cart'}), 409

        # 添加商品到购物车
        cursor.execute("""
            UPDATE user_account 
            SET carts = JSON_ARRAY_APPEND(carts, '$', %s) 
            WHERE email = %s
        """, (product_id, user_id))
        connection.commit()

        return jsonify({'message': 'Product added to cart'}), 200

    except mysql.connector.Error as err:
        return jsonify({'message': 'Error updating cart', 'error': str(err)}), 500

    finally:
        cursor.close()
        connection.close()


def remove_from_cart(user_email,data):
    user_id = user_email
    product_id = data.get('P_ID')

    if not user_id or not product_id:
        return jsonify({'message': 'user_id and product_id are required'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Remove product from cart
        cursor.execute("""
            UPDATE user_account 
            SET carts = JSON_REMOVE(carts, JSON_UNQUOTE(JSON_SEARCH(carts, 'one', %s)))
            WHERE email = %s
        """, (product_id, user_id))
        connection.commit()

        return jsonify({'message': 'Product removed from cart'}), 200

    except mysql.connector.Error as err:
        return jsonify({'message': 'Error updating cart', 'error': str(err)}), 500

    finally:
        cursor.close()
        connection.close()
