from requests import request
from flask import Flask, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/property_db"
mongo = PyMongo(app)


@app.route('/listings', methods=['GET'])
def get_properties():
    properties = mongo.db.listings.find()
    result = []
    for property in properties:
        property['_id'] = str(property['_id'])  # Convert ObjectId to string
        result.append(property)
    return jsonify(result)



@app.route('/properties', methods=['POST'])
def add_property():
    property_data = request.json
    mongo.db.listings.insert_one(property_data)
    return jsonify({'msg': 'Property added successfully'})


if __name__ == '__main__':
    app.run(debug=True)