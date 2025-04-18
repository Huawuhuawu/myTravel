from flask import Flask, request

app = Flask(__name__)

@app.route('/run-python', methods=['POST'])
def run_python():
    data = request.get_json()
    total_to_include = data.get('total_to_include', 0)
    exclude_indices = data.get('exclude_indices', [])
    way_to_move = data.get('way_to_move', "walking")

    # 模擬你的邏輯
    # 這裡你可以根據收到的資料做真正的處理（查資料庫、計算路線等）

    result_html = f"""
    <h3>旅遊路線規劃完成</h3>
    <p>包含景點數: {total_to_include}</p>
    <p>排除的景點編號: {exclude_indices}</p>
    <p>移動方式: {way_to_move}</p>
    """

    return result_html

if __name__ == '__main__':
    app.run(debug=True)
