fetch('http://127.0.0.1:5000/weather')
    .then(response => response.json())  // 解析 JSON
    .then(data => {
        // 更新 HTML 中的數據
        document.getElementById('temperature').textContent = `${data.temperature}°C`;
        document.getElementById('rainfall').textContent = `${data.rainfall}mm`;
        document.getElementById('wind-speed').textContent = `${data.wind_speed}km/h`;
    })
    .catch(error => console.error('Error fetching weather data:', error));
