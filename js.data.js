// Data for Indian cities with AQI information
const aqiData = {
    current: [
        { location: 'Delhi', aqi: 285, timestamp: '2024-03-14 10:00', lat: 28.6139, lng: 77.2090 },
        { location: 'Mumbai', aqi: 155, timestamp: '2024-03-14 10:00', lat: 19.0760, lng: 72.8777 },
        { location: 'Kolkata', aqi: 175, timestamp: '2024-03-14 10:00', lat: 22.5726, lng: 88.3639 },
        { location: 'Bangalore', aqi: 95, timestamp: '2024-03-14 10:00', lat: 12.9716, lng: 77.5946 },
        { location: 'Chennai', aqi: 110, timestamp: '2024-03-14 10:00', lat: 13.0827, lng: 80.2707 },
        { location: 'Lucknow', aqi: 225, timestamp: '2024-03-14 10:00', lat: 26.8467, lng: 80.9462 },
        { location: 'Kanpur', aqi: 245, timestamp: '2024-03-14 10:00', lat: 26.4499, lng: 80.3319 },
        { location: 'Patna', aqi: 198, timestamp: '2024-03-14 10:00', lat: 25.5941, lng: 85.1376 },
        { location: 'Ahmedabad', aqi: 165, timestamp: '2024-03-14 10:00', lat: 23.0225, lng: 72.5714 },
        { location: 'Pune', aqi: 135, timestamp: '2024-03-14 10:00', lat: 18.5204, lng: 73.8567 }
    ],
    historical: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        values: {
            'Delhi': [195, 285, 345, 325, 290, 285],
            'Mumbai': [82, 125, 155, 145, 150, 155],
            'Kolkata': [110, 145, 185, 195, 180, 175]
        }
    }
};