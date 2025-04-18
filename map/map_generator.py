import pandas as pd
from itertools import permutations
from geopy.distance import geodesic
import googlemaps
import folium
import polyline
import requests
from dotenv import load_dotenv
import os

load_dotenv()   

# ========== 使用者設定 ==========
csv_path = 'map/food_data.csv'
try:
    df = pd.read_csv(csv_path)
    print(df.head())  # 顯示前幾筆資料
except pd.errors.EmptyDataError:
    print("CSV 檔案是空的，請檢查檔案內容。")
    
output_map = 'map/推薦路徑+Ubike資訊強化版.html'
start_point = (22.639444, 120.302778)# 起點
total_to_include = 6# 使用者想要的景點數量(最多8個)
exclude_indices = [0, 3]# 使用者不希望被加入的景點編號
way_to_move = "walking"# 使用者的移動方式(driving) 

API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')
gmaps = googlemaps.Client(key=API_KEY)

# ========== 載入推薦景點資料 ==========
df = pd.read_csv(csv_path)
df = df.dropna(subset=['lat', 'lng']).reset_index(drop=True)
df_filtered = df.drop(exclude_indices).reset_index(drop=True)
selected_df = df_filtered.head(total_to_include)
next_idx = total_to_include
while len(selected_df) < total_to_include and next_idx < len(df):
    selected_df = pd.concat([selected_df, df.iloc[[next_idx]]], ignore_index=True)
    next_idx += 1

places = list(zip(selected_df['lat'], selected_df['lng']))
names = list(selected_df['店名'])

# ========== TSP 路徑排列 ==========
best_order = None
shortest_distance = float('inf')
for perm in permutations(range(len(places))):
    dist = geodesic(start_point, places[perm[0]]).km
    for i in range(len(perm) - 1):
        dist += geodesic(places[perm[i]], places[perm[i + 1]]).km
    if dist < shortest_distance:
        shortest_distance = dist
        best_order = perm

ordered_places = [start_point] + [places[i] for i in best_order]
ordered_names = ['現在位置'] + [names[i] for i in best_order]

# ========== Google Maps 路線 ==========
origin = f"{start_point[0]},{start_point[1]}"
waypoints = [f"{places[i][0]},{places[i][1]}" for i in best_order[:-1]]
destination = f"{places[best_order[-1]][0]},{places[best_order[-1]][1]}"
directions_result = gmaps.directions(origin, destination, waypoints=waypoints, mode=way_to_move, optimize_waypoints=False)
decoded_path = polyline.decode(directions_result[0]['overview_polyline']['points'])

# ========== 畫地圖 ==========
m = folium.Map(location=start_point, zoom_start=14)

# 加入推薦景點
for i, (coord, name) in enumerate(zip(ordered_places, ordered_names)):
    folium.Marker(coord, popup=f"{i+1}. {name}", icon=folium.Icon(color='red')).add_to(m)

# 畫導航路線
folium.PolyLine(decoded_path, weight=6, color='red').add_to(m)

# ========== 加入 YouBike 點：包含「可借車輛數」與「更新時間」 ==========
ubike_api = "https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092"
ubike_data = requests.get(ubike_api).json()
ubike_stations = ubike_data["data"]["data"]["retVal"]

for info in ubike_stations:
    lat = float(info["lat"])
    lng = float(info["lng"])
    name = info["sna"]
    sbi = info["sbi"]
    mday = info["mday"]
    popup_text = f"{name}<br>可借車輛：{sbi}<br>更新時間：{mday}"
    folium.CircleMarker(
        location=(lat, lng),
        radius=4,
        popup=popup_text,
        color='blue',
        fill=True,
        fill_opacity=0.6
    ).add_to(m)

# 儲存地圖
m.save(output_map)
print("地圖完成，包含推薦路徑與強化版 YouBike 資訊")