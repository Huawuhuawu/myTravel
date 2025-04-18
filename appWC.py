from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import subprocess



app = Flask(__name__, template_folder='../')  # 指定模板資料夾為 newProject 資料夾
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return 'Hello World!'

@app.route('/weather')
def get_weather():
    # 這行如果你的爬蟲程式叫 `weatherSpiderWC.py`，會執行它來更新數據
    subprocess.run(['python', 'weatherSpiderWC.py'])  

    # 讀取 `weather_data_weather_check`
    with open('weather/weather_data_weather_check.txt', 'r') as file:
        data = file.read().split(',')
        temperature, rainfall, wind_speed = data

    return jsonify({
        'temperature': temperature,
        'rainfall': rainfall,
        'wind_speed': wind_speed
    })

if __name__ == '__main__':
    app.run()
