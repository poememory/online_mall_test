# product.py
from flask import jsonify
from db import get_db_connection
import mysql.connector
from mysql.connector import Error


def fetch_data_by_pid(table, pid):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        if not connection:
            raise Exception("Failed to connect to the database.")
        cursor = connection.cursor()
        query = "SELECT * FROM {} WHERE P_ID = %s".format(table)
        cursor.execute(query, (pid,))
        results = cursor.fetchall()
        return results
    except Error as e:
        raise e
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()



def fetch_single_data_by_pids(table, pid):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        if not connection:
            raise Exception("Failed to connect to the database.")

        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM {} WHERE P_ID = %s LIMIT 1".format(table)
        cursor.execute(query, (pid,))
        result = cursor.fetchone()
        return result
    except Error as e:
        raise e
    finally:
        if cursor and cursor.close:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def homedetail(data):
    tables = ['phone', 'laptop','tablet','displayer','camera','earwears','keyboard','mouse']  # 可以根据需要添加更多的表名
    results = {}

    try:
        for table in tables:
            pids = data.get(table)
            if pids:
                # 获取单条符合条件的记录
                for pid in pids:
                    single_data = fetch_single_data_by_pids(table, pid)
                    if table not in results:
                        results[table] = []
                    results[table].append(single_data)

        return jsonify(results)

    except Error as e:
        return jsonify({'message': 'Database error', 'error': str(e)}), 500


def product_detail(data):
    tables = ['phone', 'laptop','tablet','displayer','camera','earwears','keyboard','mouse']  # 可以根据需要添加更多的表名
    results = []

    try:
        for table in tables:
            pid = data.get("P_ID")
            all_data = fetch_data_by_pid(table, pid)

            if all_data:
                for item in all_data:
                    results.append({
                        "taobao_ID": item[0],
                        "Image_URL": item[2],
                        "name": item[3],
                        "Price": item[4],
                        "x1": item[5],
                        "x2": item[6],
                        "x3": item[7]
                    })

        return jsonify(results)

    except Error as e:
        return jsonify({'message': 'Database error', 'error': str(e)}), 500


def productKind(data):
    kind = data.get('kind')
    if not kind:
        return jsonify({'message': 'kind is required'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)  # 使用 dictionary=True 返回字典格式的数据
        query = """
            SELECT 
                P_ID, 
                MIN(Name) as Name,
                MIN(Image_URL) as Image_URL,
                MIN(Price) as price
            FROM {}
            GROUP BY P_ID
        """.format(kind)
        cursor.execute(query)
        data = cursor.fetchall()

    except Error as e:
        return jsonify({'message': 'Error fetching data', 'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    if data:
        return jsonify(data), 200
    else:
        return jsonify({'message': 'there is no such kind'}), 404