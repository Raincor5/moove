import json

def flatten_json_to_dict(file_path):
    """
    Flattens a JSON file containing a list of dictionaries into a single dictionary.

    :param file_path: Path to the JSON file.
    :return: Flattened dictionary.
    """
    with open(file_path, 'r') as file:
        data = json.load(file)

    flattened_dict = {}
    for item in data:
        if isinstance(item, dict):
            flattened_dict.update(item)

    return flattened_dict

def save_to_json(data, output_file_path):
    """
    Saves data to a JSON file.

    :param data: Data to be saved.
    :param output_file_path: Output file path.
    """
    with open(output_file_path, 'w') as file:
        json.dump(data, file, indent=4)

# Example usage
input_file_path = 'extracted_data-bkup.json'
output_file_path = 'extracted_data.json'

flattened_dict = flatten_json_to_dict(input_file_path)
save_to_json(flattened_dict, output_file_path)

print(f"Flattened data saved to {output_file_path}")
