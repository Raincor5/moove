import json
from pymongo import MongoClient


def populate_database(json_file_path, db_name, collection_name):
    """
    Populates a MongoDB database with data from a JSON file.

    :param json_file_path: Path to the JSON file.
    :param db_name: Name of the MongoDB database.
    :param collection_name: Name of the collection in the database.
    """
    # Connect to MongoDB
    client = MongoClient('localhost', 27017)  # Adjust connection parameters as needed
    db = client[db_name]
    collection = db[collection_name]

    # Read data from JSON file
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    # Insert data into the collection
    if isinstance(data, list):
        collection.insert_many(data)
    elif isinstance(data, dict):
        collection.insert_one(data)
    else:
        raise ValueError("Data must be a dictionary or a list of dictionaries.")

    print(f"Data from {json_file_path} has been inserted into {db_name}.{collection_name}")


# Example usage
json_file_path = 'extracted_data.json'  # Path to your JSON file
db_name = 'property_db'           # Name of your MongoDB database
collection_name = 'listings'  # Name of your collection

populate_database(json_file_path, db_name, collection_name)
