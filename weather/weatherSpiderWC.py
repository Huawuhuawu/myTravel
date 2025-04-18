import requests
import time
import os
from bs4 import BeautifulSoup

def fetch_weather():
    url = "https://weather.com/zh-TW/weather/hourbyhour/l/56f5f1d2a8315c8ccb71428bcd15e1b9fbc310a342b9eb95c1a60f9cba14e1f7"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"}

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # 提取需要的數據
        temperature = soup.find("span", {"data-testid": "TemperatureValue"}).text if soup.find("span", {"data-testid": "TemperatureValue"}) else "N/A"
        rain_probability = soup.find("span", {"data-testid": "PercentageValue"}).text if soup.find("span", {"data-testid": "PercentageValue"}) else "N/A"
        wind_data = soup.find("span", {"data-testid": "Wind"}).text if soup.find("span", {"data-testid": "Wind"}) else "N/A"

        # 只提取數字部分
        temperature_value = ''.join(filter(str.isdigit, temperature))
        rain_probability_value = ''.join(filter(str.isdigit, rain_probability))
        wind_speed_value = ''.join(filter(str.isdigit, wind_data))

        # 取得 `scraper.py` 的目錄，確保 `txt` 檔案存放於相同目錄
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        TXT_FILE_PATH = os.path.join(BASE_DIR, "weather_data_weather_check.txt")

        # 每次寫入前清空文件並寫入數據
        with open(TXT_FILE_PATH, "w", encoding="utf-8") as file:
            file.write(f"{temperature_value},{rain_probability_value},{wind_speed_value}\n")

        print(f"天氣數據已儲存至 {TXT_FILE_PATH}")
    else:
        print("無法獲取天氣數據，請檢查網路或網址。")

if __name__ == "__main__":
    while True:
        fetch_weather()
        time.sleep(3600)  # 每小時更新一次
