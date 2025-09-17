console.log("script.js loaded and executing!");
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const hourlyCardsDiv = document.querySelector(".hourly-cards");
const historyList = document.querySelector("#history-list");
const autocompleteContainer = document.querySelector(".autocomplete-container");
const loadingIndicator = document.querySelector(".loading-indicator");
const weatherData = document.querySelector(".weather-data");
const recommendationText = document.querySelector("#recommendation-text");

// Global variable for unit preference
let isFahrenheit = localStorage.getItem('isFahrenheit') === 'true';

// Helper functions for temperature conversion
const kelvinToCelsius = (kelvin) => (kelvin - 273.15);
const kelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5) + 32;

const formatTemperature = (kelvin) => {
    if (isFahrenheit) {
        return `${kelvinToFahrenheit(kelvin).toFixed(2)}°F`;
    }
    return `${kelvinToCelsius(kelvin).toFixed(2)}°C`;
};

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let aqiChart;

// Mapping for dynamic backgrounds
const weatherBackgrounds = {
    'Clear': 'url("https://images.unsplash.com/photo-1558418294-9da189822862?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Sunny
    'Clouds': 'url("https://images.unsplash.com/photo-1501630834273-4b56d1cd9108?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Cloudy
    'Rain': 'url("https://images.unsplash.com/photo-1534274988757-32175230bd74?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Rainy
    'Drizzle': 'url("https://images.unsplash.com/photo-1534274988757-32175230bd74?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Drizzle (same as rain)
    'Thunderstorm': 'url("https://images.unsplash.com/photo-1597672927200-7219a312121d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Thunderstorm
    'Snow': 'url("https://images.unsplash.com/photo-1542601098-8fc1149e10e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Snowy
    'Mist': 'url("https://images.unsplash.com/photo-1543879330-d05e6503086c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Mist/Fog
    'Smoke': 'url("https://images.unsplash.com/photo-1543879330-d05e6503086c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Smoke (same as mist)
    'Haze': 'url("https://images.unsplash.com/photo-1543879330-d05e6503086c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Haze (same as mist)
    'Dust': 'url("https://images.unsplash.com/photo-1543879330-d05e6503086c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Dust (same as mist)
    'Fog': 'url("https://images.unsplash.com/photo-1543879330-d05e6503086c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Fog (same as mist)
    'Sand': 'url("https://images.unsplash.com/photo-1543879330-d05e6503086c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Sand (same as mist)
    'Ash': 'url("https://images.unsplash.com/photo-1543879330-d05e6503086c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Ash (same as mist)
    'Squall': 'url("https://images.unsplash.com/photo-1534274988757-32175230bd74?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Squall (same as rain)
    'Tornado': 'url("https://images.unsplash.com/photo-1597672927200-7219a312121d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Tornado (same as thunderstorm)
    'Default': 'url("https://images.unsplash.com/photo-1501630834273-4b56d1cd9108?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' // Default cloudy background
};

const setDynamicBackground = (weatherCondition) => {
    const body = document.body;
    const imageUrl = weatherBackgrounds[weatherCondition] || weatherBackgrounds['Default'];
    // Add a semi-transparent overlay for better readability
    body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), ${imageUrl}`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed'; // Keep background fixed when scrolling
};

const showLoadingIndicator = () => {
    weatherData.style.display = "none";
    loadingIndicator.style.display = "block";
};

const hideLoadingIndicator = () => {
    loadingIndicator.style.display = "none";
    weatherData.style.display = "grid";
};

const createWeatherCard = (cityName, weatherItem, index, aqiData, currentWeatherData, uvi, visibility, pressure) => {
    const temp = formatTemperature(weatherItem.main.temp);
    const feelsLike = formatTemperature(currentWeatherData.main.feels_like);
    const weatherIcon = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`;
    const aqiDescription = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    const aqiText = aqiData ? aqiDescription[aqiData.main.aqi - 1] : "Unknown";

    const sunrise = new Date(currentWeatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(currentWeatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (index === 0) { // Main weather card
        return `
            <div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${temp} (Feels like: ${feelsLike})</h4>
                <h4>Wind Speed: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                <h4>Air Quality: ${aqiText}</h4>
                <h4>UV Index: ${uvi}</h4>
                <h4>Visibility: ${visibility} km</h4>
                <h4>Pressure: ${pressure} hPa</h4>
                <h4>Sunrise: ${sunrise}</h4>
                <h4>Sunset: ${sunset}</h4>
            </div>
            <div class="icon">
                <i class="wi wi-owm-${weatherItem.weather[0].icon.slice(-1)}-${weatherItem.weather[0].id}"></i>
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`;
    } else { // Forecast cards
        return `
            <li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <i class="wi wi-owm-${weatherItem.weather[0].icon.slice(-1)}-${weatherItem.weather[0].id}"></i>
                <h4>Temp: ${formatTemperature(weatherItem.main.temp)}</h4>
                <h4>Feels like: ${formatTemperature(weatherItem.main.feels_like)}</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }
};

const createHourlyCard = (weatherItem) => {
    const temp = formatTemperature(weatherItem.main.temp);
    const weatherIconCode = weatherItem.weather[0].icon;
    const weatherId = weatherItem.weather[0].id;
    const dayNight = weatherIconCode.slice(-1);
    const weatherIconClass = `wi wi-owm-${dayNight}-${weatherId}`;
    const time = weatherItem.dt_txt.split(" ")[1].substring(0, 5);

    return `
        <li class="card">
            <h3>${time}</h3>
            <i class="${weatherIconClass}"></i>
            <h4>${temp}</h4>
        </li>`;
};

const createAqiChart = (aqiData) => {
    const ctx = document.getElementById('aqi-chart').getContext('2d');
    const pollutants = aqiData.components;
    const data = {
        labels: ['CO', 'NO', 'NO2', 'O3', 'SO2', 'PM2.5', 'PM10', 'NH3'],
        datasets: [{
            label: 'μg/m³',
            data: [
                pollutants.co,
                pollutants.no,
                pollutants.no2,
                pollutants.o3,
                pollutants.so2,
                pollutants.pm2_5,
                pollutants.pm10,
                pollutants.nh3
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    if (aqiChart) {
        aqiChart.destroy();
    }

    aqiChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

const getAirQuality = async (lat, lon) => {
    const AQI_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    try {
        const res = await fetch(AQI_API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
        const data = await res.json();
        return data.list[0];
    } catch (error) {
        console.error("Error fetching air quality data:", error);
        return null;
    }
};

const getWeatherRecommendations = (temperature, weatherCondition) => {
    let recommendation = "";
    const tempCelsius = kelvinToCelsius(temperature);

    if (tempCelsius < 0) {
        recommendation += "It's freezing! Wear a heavy coat, hat, and gloves. ";
    } else if (tempCelsius < 10) {
        recommendation += "It's cold. A warm jacket and layers are recommended. ";
    } else if (tempCelsius < 20) {
        recommendation += "The weather is mild. A light jacket or sweater should be fine. ";
    } else if (tempCelsius < 30) {
        recommendation += "It's warm. Light clothing is suitable. ";
    } else {
        recommendation += "It's hot! Stay hydrated and wear light, breathable clothes. ";
    }

    if (weatherCondition.includes("rain")) {
        recommendation += "Don't forget your umbrella or raincoat!";
    } else if (weatherCondition.includes("snow")) {
        recommendation += "Bundle up for snow and wear waterproof boots.";
    } else if (weatherCondition.includes("clear")) {
        recommendation += "Enjoy the clear skies!";
    } else if (weatherCondition.includes("cloud")) {
        recommendation += "It's cloudy, but still pleasant.";
    }

    return recommendation;
};

const getWeatherDetails = async (cityName, lat, lon) => {
    showLoadingIndicator();
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const CURRENT_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const [forecastRes, currentRes] = await Promise.all([
            fetch(WEATHER_API_URL),
            fetch(CURRENT_WEATHER_API_URL)
        ]);

        if (!forecastRes.ok) throw new Error(`HTTP error! Status: ${forecastRes.status} - ${forecastRes.statusText}`);
        if (!currentRes.ok) throw new Error(`HTTP error! Status: ${currentRes.status} - ${currentRes.statusText}`);

        const forecastData = await forecastRes.json();
        const currentWeatherData = await currentRes.json();

        const uniqueForecastDays = [];
        const fiveDaysForecast = forecastData.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
            return false;
        });

        const hourlyForecast = forecastData.list.slice(0, 8);

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        hourlyCardsDiv.innerHTML = "";
        recommendationText.textContent = "";

        const aqiData = await getAirQuality(lat, lon);

        const uvi = currentWeatherData.uvi !== undefined ? currentWeatherData.uvi : 'N/A';
            const visibility = currentWeatherData.visibility !== undefined ? (currentWeatherData.visibility / 1000).toFixed(1) : 'N/A'; // Convert to km
            const pressure = currentWeatherData.main.pressure !== undefined ? currentWeatherData.main.pressure : 'N/A';

            fiveDaysForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherItem, index, aqiData, currentWeatherData, uvi, visibility, pressure);
                if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });

        hourlyForecast.forEach(weatherItem => {
            hourlyCardsDiv.insertAdjacentHTML("beforeend", createHourlyCard(weatherItem));
        });

        if (aqiData) {
            createAqiChart(aqiData);
        }

        const recommendations = getWeatherRecommendations(currentWeatherData.main.temp, currentWeatherData.weather[0].description);
        recommendationText.textContent = recommendations;

        setDynamicBackground(currentWeatherData.weather[0].main);

        updateMap(lat, lon);
    } catch (error) {
        console.error("Error fetching weather forecast:", error);
        alert("An error occurred while fetching the weather forecast: " + error.message);
    } finally {
        hideLoadingIndicator();
    }
};

const updateSearchHistory = (city) => {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    displaySearchHistory();
};

const displaySearchHistory = () => {
    historyList.innerHTML = "";
    searchHistory.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.addEventListener("click", () => {
            cityInput.value = city;
            getCityCoordinates();
        });
        historyList.appendChild(li);
    });
};

const fetchAutocompleteSuggestions = async (text) => {
    if (text.length < 3) {
        autocompleteContainer.innerHTML = "";
        return;
    }

    const AUTOCOMPLETE_API_URL = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${GEOAPIFY_API_KEY}`;

    try {
        const res = await fetch(AUTOCOMPLETE_API_URL);
        const data = await res.json();
        displayAutocompleteSuggestions(data.features);
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
    }
};

const displayAutocompleteSuggestions = (suggestions) => {
    if (!suggestions || suggestions.length === 0) {
        autocompleteContainer.innerHTML = "";
        return;
    }

    const suggestionsHTML = suggestions.map(suggestion => `
        <div class="suggestion" data-city="${suggestion.properties.city}">${suggestion.properties.formatted}</div>
    `).join("");

    autocompleteContainer.innerHTML = suggestionsHTML;

    document.querySelectorAll(".suggestion").forEach(suggestion => {
        suggestion.addEventListener("click", () => {
            cityInput.value = suggestion.dataset.city;
            autocompleteContainer.innerHTML = "";
            getCityCoordinates();
        });
    });
};

const getCityCoordinates = async () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    updateSearchHistory(cityName);

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
cityInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        getCityCoordinates();
    } else {
        fetchAutocompleteSuggestions(cityInput.value);
    }
});
window.addEventListener("load", () => {
    displaySearchHistory();
    getUserCoordinates();
    updateUnitToggleButton(); // Ensure button text is correct on load
});

const options = {
    key: WINDY_API_KEY,
    lat: 19.0760,
    lon: 72.8777,
    zoom: 10,
};

let windyAPI;

const updateMap = (lat, lon) => {
    if (windyAPI && typeof windyAPI.map.setView === 'function') {
        windyAPI.map.setView([lat, lon], 12);
    } else {
        console.error("Windy API not initialized or setView method not available.");
    }
};

windyInit(options, api => {
    windyAPI = api;
});

const darkModeToggle = document.querySelector('.dark-mode-toggle');
console.log("darkModeToggle element:", darkModeToggle);
const htmlElement = document.documentElement;
const icon = darkModeToggle.querySelector('i');

// Apply dark mode immediately if enabled in localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    console.log("Dark mode enabled in localStorage. Applying dark mode.");
    htmlElement.classList.add('dark-mode');
    icon.classList.replace('fa-sun', 'fa-moon');
} else {
    console.log("Dark mode not enabled in localStorage.");
}

darkModeToggle.addEventListener('click', () => {
    console.log("Dark mode toggle clicked.");
    htmlElement.classList.toggle('dark-mode');
    if (htmlElement.classList.contains('dark-mode')) {
        console.log("Dark mode class added.");
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        console.log("Dark mode class removed.");
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('darkMode', 'disabled');
    }
});

const unitToggle = document.querySelector('.unit-toggle');

// Function to update the unit toggle button text
const updateUnitToggleButton = () => {
    unitToggle.textContent = isFahrenheit ? '°F' : '°C';
};

// Initial update of the unit toggle button
updateUnitToggleButton();

unitToggle.addEventListener('click', () => {
    isFahrenheit = !isFahrenheit; // Toggle the unit
    localStorage.setItem('isFahrenheit', isFahrenheit); // Store preference
    updateUnitToggleButton(); // Update button text

    // Re-fetch and re-render weather data with the new unit
    // We need to know the current city's coordinates to re-fetch
    // For simplicity, we'll re-trigger the last known location search
    // This assumes either getCityCoordinates or getUserCoordinates was called last
    if (searchHistory.length > 0 && cityInput.value) {
        getCityCoordinates(); // Re-fetch for the currently displayed city
    } else {
        getUserCoordinates(); // Re-fetch for current location
    }
});