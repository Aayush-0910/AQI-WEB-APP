// Map initialization and marker management
function initMap() {
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    aqiData.current.forEach(loc => {
        const aqiClass = getAQIClass(loc.aqi);
        const color = getMarkerColor(aqiClass);
        
        L.circleMarker([loc.lat, loc.lng], {
            radius: 12,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        })
        .bindPopup(`
            <strong>${loc.location}</strong><br>
            AQI: ${loc.aqi}<br>
            Status: ${getAQIDescription(loc.aqi)}
        `)
        .addTo(map);
    });
}

function getMarkerColor(aqiClass) {
    const colors = {
        'good': '#2ecc71',
        'moderate': '#f1c40f',
        'unhealthy-sensitive': '#e67e22',
        'unhealthy': '#e74c3c',
        'very-unhealthy': '#9b59b6',
        'hazardous': '#8e44ad'
    };
    return colors[aqiClass] || '#95a5a6';
}