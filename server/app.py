from flask import Flask, jsonify

# instantiate app
app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/test')
def tester():
    return "Hey, this is a test!"