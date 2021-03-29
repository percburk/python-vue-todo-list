from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import os
import pg8000.native

# Instantiate app
app = Flask(__name__)
app.config.from_object(__name__)
CORS(app)


@app.route('/api/todos', methods=['GET', 'POST'])
def todos():
    conn = pg8000.dbapi.connect(
        user=os.getenv('POSTGRES_USER'),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    if request.method == 'GET':
        cur.execute('SELECT * FROM "todos";')
        rows = cur.fetchall()
        keys = [k[0] for k in cur.description]
        results = jsonify([dict(zip(keys, row)) for row in rows])
        conn.commit()
        return results

    elif request.method == 'POST':
        new_task = request.get_json()
        query = """
            INSERT INTO "todos" ("task", "due_date", "priority")
            VALUES (%s, %s, %s);
        """
        cur.execute(
            query,
            (new_task['task'], new_task['due_date'], new_task['priority'])
        )
        conn.commit()
        return make_response('CREATED', 201)

    else:
        print('no routes found')
        return 'no routes found'
