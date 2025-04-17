from flask import Flask, request

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return "Hello from the Flask server!"

@app.route("/login", methods=["POST"])
def login():
    data = request.form
    return f"Received username: {data.get('username')}, password: {data.get('password')}"

print("er ")
app.run(host="0.0.0.0", port=80)  # Expose on all interfaces
