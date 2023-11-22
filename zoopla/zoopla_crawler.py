import os
import time
import random
from datetime import datetime
from selenium import webdriver
from paginator import total_pages
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


def crawl_zoopla_pages(deal_type, city, max_page_number, delay=5):
    """
    Crawls all pages for a given deal type and city on Zoopla and saves HTML source.

    :param deal_type: The deal type ('for-sale' or 'to-rent').
    :param city: The city for the property listing.
    :param max_page_number: The maximum number of pages to crawl.
    :param delay: Time delay between page requests in seconds.
    """
    base_url = f"https://www.zoopla.co.uk/{deal_type}/property/{city}/?pn={{page_number}}"
    date_str = datetime.now().strftime("%Y-%m-%d")
    directory = f"./crawled_pages/{deal_type}/{city}/{date_str}"

    # Create directory if it doesn't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Initialize the WebDriver
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        " AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    )

    for page_number in range(1, max_page_number + 1):
        # Initialize the WebDriver for each page
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            " AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        )
        driver = webdriver.Chrome(options=options)

        try:
            page_url = base_url.format(page_number=page_number)
            print(f"Accessing page: {page_url}")

            driver.get(page_url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "main-content"))
            )
            time.sleep(delay + random.uniform(0.5, 1.5))

            html_source = driver.page_source

            # Save the HTML source to file
            file_name = f"{deal_type}_{city}_pn-{page_number}.html"
            file_path = os.path.join(directory, file_name)
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(html_source)

        except TimeoutException:
            print(f"Timeout reached while loading page {page_number}. Skipping...")
            continue
        finally:
            # Close the WebDriver after each page
            driver.quit()


# Example usage
crawl_zoopla_pages('to-rent', 'aberdeen', max_page_number=total_pages(
    "./page_sources/www.zoopla.co.uk-to-rent-property-aberdeen.html",
                  "total-results",
            "listing_"), delay=10)
