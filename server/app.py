from flask import Flask, jsonify, request, make_response
from datetime import datetime
from flask_cors import CORS
import os
import pg8000


# Start app, add CORS to all routes
app = Flask(__name__)
app.config.from_object(__name__)
CORS(app)


# GET route for todo table with sorting
@app.route("/api/todos/", defaults={'sort': None}, methods=["GET"])
@app.route("/api/todos/sort/<sort>", methods=["GET"])
def todos(sort):
    conn = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    if sort == "task":
        sort_text = '"done", "task", "due_date";'
    elif sort == "priority":
        sort_text = '"done", "priority" DESC, "due_date", "task";'
    else:
        sort_text = '"done", "due_date", "task";'

    cur.execute(f'SELECT * FROM "todos" ORDER BY {sort_text}')
    rows = cur.fetchall()
    keys = [k[0] for k in cur.description]
    results = [dict(zip(keys, row)) for row in rows]
    for row in results:
        row["due_date"] = row["due_date"].isoformat()
    conn.commit()
    return jsonify(results)

# Add a new task to the db


@app.route("/api/todos/add", methods=["POST"])
def add_task():
    conn = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    new_task = request.get_json()
    sql_text = """
        INSERT INTO "todos" ("task", "due_date", "priority")
        VALUES (%s, %s, %s);
    """
    cur.execute(sql_text, (
        new_task["task"],
        new_task["due_date"],
        new_task["priority"]
    ))
    conn.commit()
    return make_response("Created", 201)


# One task manipulation - delete, toggle done status, get one task for editing
@app.route("/api/todos/<id>", methods=["DELETE", "PUT", "GET"])
def delete_complete_todo(id):
    conn = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    if request.method == "DELETE":
        cur.execute('DELETE FROM "todos" WHERE "id" = %s;', (id,))
        conn.commit()
        return make_response("Deleted", 204)

    elif request.method == "PUT":
        sql_text = 'UPDATE "todos" SET "done" = NOT "done" WHERE "id" = %s;'
        cur.execute(sql_text, (id,))
        conn.commit()
        return make_response("Updated", 200)

    else:
        cur.execute('SELECT * FROM "todos" WHERE "id" = %s;', (id,))
        rows = cur.fetchall()
        keys = [k[0] for k in cur.description]
        results = dict(zip(keys, rows[0]))
        results["due_date"] = results["due_date"].isoformat()
        conn.commit()
        return jsonify(results)


# Toggle task priority
@app.route("/api/todos/priority", methods=["PUT"])
def toggle_task_priority():
    task_id = request.get_json()["id"]
    priority = request.get_json()["priority"]

    conn = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    if priority == "!":
        new_priority = "!!"
    elif priority == "!!":
        new_priority = "!!!"
    else:
        new_priority = "!"

    sql_text = 'UPDATE "todos" SET "priority" = %s WHERE "id" = %s;'
    cur.execute(sql_text, (new_priority, task_id))
    conn.commit()
    return make_response('Updated', 200)

# Edit all aspects of a task


@app.route("/api/todos/edit", methods=["PUT"])
def edit_task():
    task_to_edit = request.get_json()

    conn = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"),
        database="python_vue_todo"
    )
    cur = conn.cursor()

    sql_text = """
        UPDATE "todos" SET "task" = %s, "due_date" = %s, "priority" = %s
        WHERE "id" = %s;
    """
    cur.execute(sql_text, (
        task_to_edit["task"],
        task_to_edit["due_date"],
        task_to_edit["priority"],
        task_to_edit["id"]
    ))
    conn.commit()
    return make_response('Updated', 200)
