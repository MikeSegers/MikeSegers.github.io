function updateTime() {
    // Get current time
    const now = new Date();
    // Format hours and minutes with leading zeroes if necessary
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // Combine hours and minutes
    const timeString = hours + ':' + minutes;
    // Display the time on the clock div
    document.getElementById('liveClock').textContent = timeString;
}

// Update the time every second (1000 milliseconds)
setInterval(updateTime, 1000);

// Initial call to display time immediately when page loads
updateTime();
