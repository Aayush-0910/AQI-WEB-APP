const API_KEY =   '567ddd9891f1eab8e4037ff2f31f59d7'; // Obtain your API key from https://aqicn.org/

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getAQI(city);
    }
});

function getAQI(city) {
    // Replace spaces in city name with "+" for the API request
    const cityName = city.replace(/\s+/g, '+');
    
    // Construct the URL for the AQI API request
    const url = `https://api.waqi.info/feed/${cityName}/?token=${API_KEY}`;
    
    // Fetch AQI data for the entered city
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                const aqi = data.data.aqi;
                const city = data.data.city.name;
                document.getElementById('city').textContent = city;
                document.getElementById('aqi-value').textContent = aqi;
            } else {
                alert("City not found or data unavailable. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error fetching AQI data:", error);
            alert("An error occurred. Please try again.");
        });
}
