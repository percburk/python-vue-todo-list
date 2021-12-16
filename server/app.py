from flask import Flask, jsonify, request, make_response
from datetime import timedelta, date
from flask_cors import CORS
import os
import pg8000

# Start app, add CORS to all routes
app = Flask(__name__)
app.config.from_object(__name__)
CORS(app)


# GET route for todo table with sorting
@app.route("/api/todos/", defaults={"sort": None}, methods=["GET"])
@app.route("/api/todos/sort/<sort>", methods=["GET"])
def todos(sort):
    connection = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"), database="python_vue_todo"
    )
    cursor = connection.cursor()

    if sort == "task" or sort == "task-down":
        sort_text = f"""
            "done", "task" {"DESC" if sort == "task-down" else ""}, "due_date";
        """
    elif sort == "priority" or sort == "priority-down":
        sort_text = f"""
            "done", "priority" {"ASC" if sort == "priority-down" else "DESC"},
            "due_date", "task";
        """
    else:
        sort_text = f"""
            "done", "due_date" {"DESC" if sort == "date-down" else ""}, "task";
        """

    cursor.execute(f'SELECT * FROM "todos" ORDER BY {sort_text}')
    rows = cursor.fetchall()
    keys = [k[0] for k in cursor.description]
    results = [dict(zip(keys, row)) for row in rows]
    for row in results:
        today = date.today()
        row["overdue"] = row["due_date"] < today

        if row["due_date"] == today:
            row["date_display"] == "Today"
        elif row["due_date"] == today + timedelta(days=1):
            row["date_display"] = "Tomorrow"
        elif row["due_date"] == today - timedelta(days=1):
            row["date_display"] = "Yesterday"
        else:
            row["date_display"] = row["due_date"].strftime("%b %d").replace(" 0", " ")

        row["due_date"] = row["due_date"].isoformat()
    connection.commit()
    return jsonify(results)


# Add a new task to the db
@app.route("/api/todos/add", methods=["POST"])
def add_task():
    connection = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"), database="python_vue_todo"
    )
    cursor = connection.cursor()
    new_task = request.get_json()
    sql_text = """
        INSERT INTO "todos" ("task", "due_date", "priority")
        VALUES (%s, %s, %s);
    """
    cursor.execute(
        sql_text, (new_task["task"], new_task["due_date"], new_task["priority"])
    )
    connection.commit()
    return make_response("Created", 201)


# One task manipulation - delete, toggle done status, get one task for editing
@app.route("/api/todos/<id>", methods=["DELETE", "PUT", "GET"])
def delete_complete_todo(id):
    connection = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"), database="python_vue_todo"
    )
    cursor = connection.cursor()

    if request.method == "DELETE":
        cursor.execute('DELETE FROM "todos" WHERE "id" = %s;', (id,))
        connection.commit()
        return make_response("Deleted", 204)

    elif request.method == "PUT":
        sql_text = 'UPDATE "todos" SET "done" = NOT "done" WHERE "id" = %s;'
        cursor.execute(sql_text, (id,))
        connection.commit()
        return make_response("Updated", 200)

    else:
        cursor.execute('SELECT * FROM "todos" WHERE "id" = %s;', (id,))
        rows = cursor.fetchall()
        keys = [k[0] for k in cursor.description]
        results = dict(zip(keys, rows[0]))
        results["due_date"] = results["due_date"].isoformat()
        connection.commit()
        return jsonify(results)


# Toggle task priority
@app.route("/api/todos/priority", methods=["PUT"])
def toggle_task_priority():
    task_id = request.get_json()["id"]
    priority = request.get_json()["priority"]

    connection = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"), database="python_vue_todo"
    )
    cursor = connection.cursor()

    if priority == "!":
        new_priority = "!!"
    elif priority == "!!":
        new_priority = "!!!"
    else:
        new_priority = "!"

    sql_text = 'UPDATE "todos" SET "priority" = %s WHERE "id" = %s;'
    cursor.execute(sql_text, (new_priority, task_id))
    connection.commit()
    return make_response("Updated", 200)


# Edit all aspects of a task
@app.route("/api/todos/edit", methods=["PUT"])
def edit_task():
    task_to_edit = request.get_json()

    connection = pg8000.dbapi.connect(
        user=os.getenv("POSTGRES_USER"), database="python_vue_todo"
    )
    cursor = connection.cursor()

    sql_text = """
        UPDATE "todos" SET "task" = %s, "due_date" = %s, "priority" = %s
        WHERE "id" = %s;
    """
    cursor.execute(
        sql_text,
        (
            task_to_edit["task"],
            task_to_edit["due_date"],
            task_to_edit["priority"],
            task_to_edit["id"],
        ),
    )
    connection.commit()
    return make_response("Updated", 200)
