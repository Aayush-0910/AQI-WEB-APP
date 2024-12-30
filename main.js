// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAndUpdate(); // Check for updates on page load
    renderAQICards();
    initChart();
    initMap();
});

// Update data every 5 minutes
setInterval(checkAndUpdate, 300000);