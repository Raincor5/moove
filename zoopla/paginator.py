from bs4 import BeautifulSoup


def total_pages(html_fiile, total_results_selector, listing_selector_substring):
    # Read the HTML content form the file
    with open(html_fiile, "r", encoding="utf-8") as file:
        html_content = file.read()

    soup = BeautifulSoup(html_content, "html.parser")

    # Extract total number of results
    total_results_element = soup.find(attrs={"data-testid": total_results_selector})
    total_results_text = total_results_element.get_text() if total_results_element else "0"
    total_results = int("".join(filter(str.isdigit, total_results_text)))

    # Count the number of listings on the page
    listings = soup.find_all(lambda tag: tag.name == "div" and tag.has_attr("id")
                                         and listing_selector_substring in tag["id"])
    listings_per_page = len(listings)

    # Calculate the total numebr of pages
    total_pages = (total_results // listings_per_page) + (1 if total_results % listings_per_page else 0)

    return total_pages

# print(total_pages("./page_sources/www.zoopla.co.uk-for-sale-property-aberdeen.html",
#                   "total-results",
#             "listing_"))