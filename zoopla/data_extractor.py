import os
import json
import googlemaps
from bs4 import BeautifulSoup


# Load your API key from a secure location
API_KEY = "AIzaSyCiRfij5vw6SLLbocakpTrhrEYYBJ-UIQw"


def geocode_address(address):
    try:
        # Initialize the Google Maps client
        gmaps = googlemaps.Client(key=API_KEY)

        # Geocode the address
        geocode_result = gmaps.geocode(address)

        # Check if any results were returned
        if geocode_result:
            # Extract latitude and longitude
            location = geocode_result[0]['geometry']['location']
            lat = location['lat']
            lng = location['lng']

            return [lat, lng]
        else:
            return [None, None]

    except Exception as e:
        return {'error': str(e)}




def extract_data_from_html(soup, filepath):
    extracted_data = []

    # Find all listings on the page
    listings = soup.find_all('div', id=lambda x: x and x.startswith('listing_'))

    for listing in listings:
        # Extract data based on the structure of the listing
        price = listing.select_one('div > div > div > div > div:nth-of-type(2) > div > a > div > div:nth-of-type(1) > div > p[data-testid="listing-price"]')
        bedrooms = listing.select_one('div > div > div > div > div:nth-of-type(2) > div > a > div > div:nth-of-type(2) > ul > li:nth-of-type(1) > span:nth-of-type(2)')
        bathrooms = listing.select_one('div > div > div > div > div:nth-of-type(2) > div > a > div > div:nth-of-type(2) > ul > li:nth-of-type(2) > span:nth-of-type(2)')
        living_rooms = listing.select_one('div > div > div > div > div:nth-of-type(2) > div > a > div > div:nth-of-type(2) > ul > li:nth-of-type(3) > span:nth-of-type(2)')
        title = listing.select_one('div > div > div > div > div:nth-of-type(2) > div > a > div > div:nth-of-type(3) > h2')
        address = listing.select_one('div > div > div > div > div:nth-of-type(2) > div > a > div > div:nth-of-type(3) > address')
        description = listing.select_one('div > div > div > div > div:nth-of-type(2) > div > a > div > div:nth-of-type(3) > p')

        coords = geocode_address(address)

        property_data = {
            'price': price.get_text().strip() if price else None,
            'bedrooms': bedrooms.get_text().strip() if bedrooms else None,
            'bathrooms': bathrooms.get_text().strip() if bathrooms else None,
            'living_rooms': living_rooms.get_text().strip() if living_rooms else None,
            'title': title.get_text().strip() if title else None,
            'address': address.get_text().strip() if address else None,
            'description': description.get_text().strip() if description else None,
            'deal_type': "to-rent" if "to-rent" in filepath else "for-sale",
            'lat': coords[0],
            'lng': coords[1]
        }

        extracted_data["listing_" + str(id(listing))] = property_data

    return extracted_data


def process_html_files(base_directory):
    extracted_data = []

    for root, dirs, files in os.walk(base_directory):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)

                with open(file_path, 'r', encoding='utf-8') as html_file:
                    html_content = html_file.read()
                    soup = BeautifulSoup(html_content, 'html.parser')

                    # Extract data from each HTML file
                    property_data = extract_data_from_html(soup, file_path)
                    extracted_data.append(property_data)

                print(f"{file_path} has been processed!")

    # Optionally, save extracted data to JSON
    with open('extracted_data.json', 'w', encoding='utf-8') as json_file:
        json.dump(extracted_data, json_file, indent=4)


# Example usage
base_directory = './crawled_pages'
process_html_files(base_directory)



