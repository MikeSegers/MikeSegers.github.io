let timeout;
let redirectTimeout;


// Function to dim the screen
function dimScreen() {
    const screenElement = document.getElementsByClassName('screen')[0]; // Get the first element with class 'screen'
    if (screenElement) {
        screenElement.style.filter = 'brightness(50%)';  // Adjust brightness to 50%
    }
}

// Function to restore brightness
function restoreScreen() {
    const screenElement = document.getElementsByClassName('screen')[0]; // Get the first element with class 'screen'
    if (screenElement) {
        screenElement.style.filter = 'brightness(100%)';  // Reset brightness to normal
    }
}

// Function to redirect to index file
function redirectToIndex() {
    const currentFile = window.location.href; // Get current URL
    if (currentFile.includes('/Apps/')) { // Check if the current URL includes a specific path
        window.location.href = "../index.html"; // Redirect to ../Index.html
    } else if (currentFile.includes('/HTML/')) { // Check if the current URL includes a specific path
        window.location.href = "../index.html"; // Redirect to ../Index.html
    } else {
        window.location.href = "index.html"; // Redirect to Index.html
    }
}

// Reset the timer on interaction
function resetTimer() {
    clearTimeout(timeout);  // Clear the previous timer
    clearTimeout(redirectTimeout); // Clear the redirect timer
    restoreScreen();  // Restore brightness on interaction

    // Set timeouts
    timeout = setTimeout(dimScreen, 25000);  // Set the dimming timeout for 30 seconds
    redirectTimeout = setTimeout(redirectToIndex, 30000); // Set redirect timeout for 45 seconds
}

// Add event listeners for user interaction
window.onload = function() {
    document.addEventListener('click', resetTimer);  // Detect mouse clicks
    document.addEventListener('keydown', resetTimer);  // Detect keyboard input
    resetTimer();  // Initialize the timer on page load
}
