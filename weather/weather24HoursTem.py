import requests
from bs4 import BeautifulSoup

def get_weather_details(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("Failed to retrieve data")
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # 修正 find_all 的語法
    precip_probs_raw = soup.find_all("span", attrs={"data-testid": "PercentageValue"})
    detail_values = soup.find_all(attrs={"class": "DetailsTable--value--pWEVz"})

    # 修正降雨機率的篩選方式
    filtered_precip = [val.text for val in precip_probs_raw]

    print("Hourly Precipitation Probabilities:")
    for i, val in enumerate(filtered_precip):
        print(f"Hour {i}: {val}")

    print("\nDetailsTable Values:")
    for i, val in enumerate(detail_values):
        print(f"Index {i}: {val.text}")

    return filtered_precip, [val.text for val in detail_values]

if __name__ == "__main__":
    url = "https://weather.com/zh-TW/weather/hourbyhour/l/9f76cdd584a68657e37c4bd2c647bf4b19819dacb0bfeff3cf912b59438858e3"
    hourly_precip, detail_values = get_weather_details(url)
