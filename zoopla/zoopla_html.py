from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize the WebDriver
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Run in headless mode (without opening a browser window)
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    " AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
)
# service = Service(ChromeDriverManager().install())
# driver = webdriver.Chrome(service=service, options=options)
driver = webdriver.Chrome(options=options)

# Open the Zoopla website
url = "https://www.zoopla.co.uk/to-rent/property/aberdeen"
driver.get(url)

# Wait for the page to load
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "main-content")))  # It's better to use explicit waits, but for simplicity, we're using time.sleep here

# Extract the page's HTML source
html_source = driver.page_source

# Close the WebDriver
driver.quit()

# Save destination
directory = "./page_sources/"
# Remove 'https://'
formatted_url = url.replace('https://', '')
# Replace '/' with '-'
formatted_url = formatted_url.replace('/', '-')
with open(f"{directory}{formatted_url}.html", "w", encoding="utf-8") as file:
    file.write(html_source)