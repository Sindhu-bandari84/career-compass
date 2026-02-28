
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend running on localhost:3000/3001
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def home():
    return jsonify({"message": "Career Compass Backend is Running!", "status": "success"}), 200

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/career_compass")
try:
    client = MongoClient(MONGO_URI)
    db = client.get_database("career_compass")
    print(f"Connected to MongoDB at {MONGO_URI}")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    db = None

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    if db is None:
        return jsonify({"error": "Database not connected"}), 500
        
    data = request.json
    users = db.users
    
    if users.find_one({"email": data['email']}):
        return jsonify({"message": "User already exists"}), 400
        
    users.insert_one(data)
    return jsonify({"email": data['email'], "fullName": data['fullName']}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    if db is None:
        return jsonify({"error": "Database not connected"}), 500
        
    data = request.json
    users = db.users
    user = users.find_one({"email": data['email']})
    
    if user and user['password'] == data['password']:
        return jsonify({"email": user['email'], "fullName": user['fullName']}), 200
        
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/assessment/save', methods=['POST'])
def save_assessment():
    if db is None:
        return jsonify({"error": "Database not connected"}), 500
        
    data = request.json
    assessments = db.assessments
    
    # Upsert: Replace existing assessment for this user or create new
    assessments.update_one(
        {"user.email": data['user']['email']},
        {"$set": data},
        upsert=True
    )
    
    return jsonify({"message": "Assessment saved successfully"}), 200

@app.route('/api/assessment/latest', methods=['GET'])
def get_assessment():
    if db is None:
        return jsonify({"error": "Database not connected"}), 500
        
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email is required"}), 400
        
    assessment = db.assessments.find_one({"user.email": email}, {"_id": 0})
    
    if assessment:
        return jsonify(assessment), 200
    return jsonify({"message": "No assessment found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
