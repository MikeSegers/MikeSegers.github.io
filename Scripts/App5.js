function callService() {
    // Hide the other screens
    document.getElementById('call-screen').style.display = 'none';
    document.getElementById('cancelled-screen').style.display = 'none';
    
    // Show the nurse-called screen
    document.getElementById('nurse-called-screen').style.display = 'block';
}

function cancelService() {
    // Hide the nurse-called screen
    document.getElementById('nurse-called-screen').style.display = 'none';
    
    // Show the cancelled screen
    document.getElementById('cancelled-screen').style.display = 'block';
}
