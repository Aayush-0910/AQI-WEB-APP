const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");

const createWeatherCard = (cityName, weatherItem, index, aqiText) => {
    const tempCelsius = (weatherItem.main.temp - 273.15).toFixed(2);
    const weatherIcon = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`;

    if (index === 0) { // Main weather card
        return `
            <div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${tempCelsius}°C</h4>
                <h4>Wind Speed: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                <h4>Air Quality: ${aqiText}</h4>
            </div>
            <div class="icon">
                <img src="${weatherIcon}" alt="weather-icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`;
    } else { // Forecast cards
        return `
            <li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="${weatherIcon}" alt="weather-icon">
                <h4>Temp: ${tempCelsius}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }
};

const getAirQuality = async (lat, lon) => {
    const AQI_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    try {
        const res = await fetch(AQI_API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
        const data = await res.json();
        const aqi = data.list[0].main.aqi;
        const aqiDescription = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
        return aqiDescription[aqi - 1] || "Unknown";
    } catch (error) {
        console.error("Error fetching air quality data:", error);
        return "Unavailable";
    }
};

const getWeatherDetails = async (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const res = await fetch(WEATHER_API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
        const data = await res.json();

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
            return false;
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        const aqiText = await getAirQuality(lat, lon);

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index, aqiText);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });

        updateMap(lat, lon);
    } catch (error) {
        console.error("Error fetching weather forecast:", error);
        alert("An error occurred while fetching the weather forecast: " + error.message);
    }
};

const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    try {
        const res = await fetch(GEOCODING_API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
        const data = await res.json();
        if (!data || data.length === 0) throw new Error("No weather data available for this location.");

        const { lat, lon } = data[0];
        await getWeatherDetails(cityName, lat, lon);
    } catch (error) {
        console.error("Error fetching city coordinates:", error);
        alert("An error occurred while fetching city coordinates: " + error.message);
    }
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        async position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            try {
                const res = await fetch(REVERSE_GEOCODING_URL);
                const data = await res.json();
                const { name } = data[0];
                await getWeatherDetails(name, latitude, longitude);
            } catch {
                alert("An error occurred while fetching the city!");
            }
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please allow location access.");
            }
        }
    );
};

searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

const options = {
    key: WINDY_API_KEY,
    lat: 19.0760,
    lon: 72.8777,
    zoom: 10,
};

let windyAPI;

windyInit(options, api => {
    windyAPI = api;
});

const updateMap = (lat, lon) => {
    if (windyAPI && typeof windyAPI.map.setView === 'function') {
        windyAPI.map.setView([lat, lon], 12);
    } else {
        console.error("Windy API not initialized or setView method not available.");
    }
};

const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');

if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-sun', 'fa-moon');
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('darkMode', 'disabled');
    }
});
