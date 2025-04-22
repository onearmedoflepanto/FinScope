from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_hot_stocks():
    options = Options()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
    )
    driver.get("https://tossinvest.com")
    time.sleep(5)

    stocks = []
    try:
        rows = driver.find_elements(By.CSS_SELECTOR, "#__next tbody tr")

        for row in rows:
            try:
                name = row.find_element(By.CSS_SELECTOR,
                    "td:nth-child(1) > div > div > div:nth-child(3) > span").text

                price = row.find_element(By.CSS_SELECTOR,
                    "td:nth-child(2) > div > div > span > span").text

                change = row.find_element(By.CSS_SELECTOR,
                    "td:nth-child(3) > div > div > div > span > span").text

                stocks.append({
                    "name": name,
                    "price": price,
                    "change": change
                })
            except Exception as e:
                print("일부 항목 스크래핑 실패:", e)
                continue
    except Exception as e:
        print("접속 실패", e)


    driver.quit()
    return stocks
