from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import os
import pg8000


# Start app, add CORS to all routes
app = Flask(__name__)
app.config.from_object(__name__)
CORS(app)


# GET and POST routes for todo table
@app.route("/api/todos", methods=["GET", "POST"])
def todos():
    conn = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    if request.method == "GET":
        cur.execute('SELECT * FROM "todos" ORDER BY "due_date";')
        rows = cur.fetchall()
        keys = [k[0] for k in cur.description]
        results = jsonify([dict(zip(keys, row)) for row in rows])
        conn.commit()
        return results

    else:
        new_task = request.get_json()
        query = """
            INSERT INTO "todos" ("task", "due_date", "priority")
            VALUES (%s, %s, %s);
        """
        cur.execute(query, (
            new_task["task"],
            new_task["due_date"],
            new_task["priority"]
        ))
        conn.commit()
        return make_response("Created", 201)


# DELETE route to delete a task, PUT route for toggling done status of task
@app.route("/api/todos/<id>", methods=["DELETE", "PUT"])
def delete_complete_todo(id):
    conn = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    if request.method == "DELETE":
        cur.execute('DELETE FROM "todos" WHERE "id" = %s', (id,))
        conn.commit()
        return make_response("Deleted", 204)

    else:
        query = 'UPDATE "todos" SET "done" = NOT "done" WHERE "id" = %s'
        cur.execute(query, (id,))
        conn.commit()
        return make_response("Updated", 200)
