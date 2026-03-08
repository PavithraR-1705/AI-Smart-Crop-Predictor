from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# MongoDB Connection (Skyway-ku panna adhe URI use pannalaam)
MONGO_URI = os.environ.get('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['smartcrop_db']
history_collection = db['crop_predictions']

@app.route('/')
def home():
    return "SMARTCROP AI Backend is Live!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    n = int(data.get('N'))
    p = int(data.get('P'))
    k = int(data.get('K'))
    
    # Simple Prediction Logic (Namba requirements-ku yetha maari)
    if n > 70 and p > 50:
        prediction = "Rice"
    elif k > 50:
        prediction = "Banana"
    else:
        prediction = "Maize"

    # Save to MongoDB
    history_collection.insert_one({
        "nutrients": {"N": n, "P": p, "K": k},
        "prediction": prediction
    })
    
    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)