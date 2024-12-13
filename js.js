const apiKey = '08edce9304296d4507e8173f8cd4cc7e';

    // 날씨 정보를 화면에 표시
    function displayWeather(data) {
      const container = document.getElementById('weatherContainer');
      const weatherId = data.weather[0].id;
      const iconCode = data.weather[0].icon;
      container.className = 'weather-container'; // 기존 클래스 초기화

      // 날씨 상태에 따른 배경색 설정
      if (weatherId >= 200 && weatherId < 300) {
        container.classList.add('thunderstorm');
      } else if (weatherId >= 300 && weatherId < 400) {
        container.classList.add('drizzle');
      } else if (weatherId >= 500 && weatherId < 600) {
        container.classList.add('rainy');
      } else if (weatherId >= 600 && weatherId < 700) {
        container.classList.add('snow');
      } else if (weatherId >= 700 && weatherId < 800) {
        container.classList.add('atmosphere');
      } else if (weatherId === 800) {
        container.classList.add('clear');
      } else if (weatherId > 800) {
        container.classList.add('cloudy');
      }

      // 날씨 정보 표시
      const weatherInfo = `
        <h2>${data.name} 날씨</h2>
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="날씨 아이콘">
        <p>온도: ${data.main.temp.toFixed(2)} °C</p>
        <p>체감 온도: ${data.main.feels_like.toFixed(2)} °C</p>
        <p>날씨: ${data.weather[0].description}</p>
        <p>습도: ${data.main.humidity}%</p>
        <p>풍속: ${data.wind.speed} m/s</p>
      `;
      document.getElementById('weatherResult').innerHTML = weatherInfo;
    }

    // 도시 이름으로 날씨 조회
    document.getElementById('getWeather').addEventListener('click', function() {
      const city = document.getElementById('cityInput').value;
      if (city) {
        fetchWeather(city);
      } else {
        alert("도시 이름을 입력하세요.");
      }
    });

    // 특정 도시의 날씨 정보를 가져오는 함수
    function fetchWeather(city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

      fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error:', error));
    }

    // 현재 위치의 날씨 정보를 가져오는 함수
    function fetchWeatherByLocation(latitude, longitude) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`;

      fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
          console.error('Error:', error);
          fetchWeather('Seoul');
        });
    }

    // 페이지 로드 시 현재 위치의 날씨를 기본으로 표시
    window.onload = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByLocation(latitude, longitude);
        }, () => {
          // 위치 권한 거부 시 서울의 날씨를 기본으로 표시
          fetchWeather('Seoul');
        });
      } else {
        // Geolocation을 지원하지 않는 경우 서울의 날씨를 기본으로 표시
        fetchWeather('Seoul');
      }
    };