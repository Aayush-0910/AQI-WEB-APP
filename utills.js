// Utility functions for AQI calculations and display
function getAQIClass(aqi) {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sensitive';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'very-unhealthy';
    return 'hazardous';
}

function getAQIDescription(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

function renderAQICards() {
    const container = document.getElementById('aqiCards');
    const sortedData = [...aqiData.current].sort((a, b) => b.aqi - a.aqi);
    
    container.innerHTML = sortedData.map(data => `
        <div class="aqi-card ${getAQIClass(data.aqi)}">
            <div class="aqi-location">${data.location}</div>
            <div class="aqi-value">${data.aqi}</div>
            <div class="aqi-status">${getAQIDescription(data.aqi)}</div>
            <div class="aqi-timestamp">Updated: ${data.timestamp}</div>
        </div>
    `).join('');
}