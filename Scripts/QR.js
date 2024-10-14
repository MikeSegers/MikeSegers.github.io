let lastScanTime = 0; // Variable to store the last scan timestamp
    
// QR/Barcode scanner success callback
function onScanSuccess(decodedText, decodedResult) {
    const userId = JSON.parse(localStorage.getItem('patientID'));
    const role = JSON.parse(localStorage.getItem('role'));
    const input_user_id = (role === 'Patient') ? userId : JSON.parse(localStorage.getItem('employeeID'));

    // Get the current timestamp
    const currentTime = Date.now();

    // Check if 1 second has passed since the last scan
    if (currentTime - lastScanTime < 1000) {
        // Prevent rapid consecutive scans
        return;
    }

    // Update the lastScanTime to the current time
    lastScanTime = currentTime;

    // Ensure userId is provided
    if (!userId) {
        alert('No user ID');
        return;
    }
    if (!decodedText) {
        alert('No data scanned');
        return;
    }
    if (!input_user_id) {
        alert('No user ID');
        return;
    }

    document.getElementById('scanned-result').innerText = `Scanned result: ${decodedText}`;

    // Distinguish between QR code (JSON format) and Barcode (raw text/numbers)
    try {
        // Try to parse the scanned text as JSON for QR code
        const qrData = JSON.parse(decodedText); // Parse the QR data

        // print qr data
        console.log(qrData);

        // if the qr data is not in the correct format, catch the error
        if (!qrData.name || !qrData.water_ml) {
            throw new Error('Invalid QR code data');
        }

        const { name, water_ml } = qrData; // Extract the name and water_ml fields

        // Send QR data to the backend via the /api/qr-scan endpoint
        fetch(baseURL + '/api/qr-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                input_user_id: input_user_id,
                name: name,      // Product name from QR code
                water_ml: water_ml // Water amount from QR code
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.message); // Show a success message
        })
        .catch(error => console.error('Error:', error));

    } catch (err) {
        // If the scanned data is not JSON (i.e., it's a barcode), handle it as a barcode
        console.log('Scanned text is not a QR code, treating as a barcode.');

        // Send barcode data to the backend via the /api/barcode-scan endpoint
        fetch(baseURL + '/api/barcode-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                inputUserId: input_user_id,
                barcode: decodedText // Send the barcode as is
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('scanned-result').innerText = `Product name: ${data.nutrition_name}`; // Display the product name
            // alert(data.message); // Show a success message
            // Fetch and display total water consumption after the scan
            fetchTotalWaterConsumption();
        })
        .catch(error => console.error('Error:', error));
    }

}

function onScanFailure(error) {
     // Filter out the specific error message that you want to ignore
     if (error === "QR code parse error, error = D: No MultiFormat Readers were able to detect the code.") {
        return; // Ignore this specific error and do not log it
    }

    console.warn(`Code scan error: ${error}`);
}

// Initialize the QR/barcode scanner
function initQrCodeScanner() {
    let html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },  // Use rear camera
        {
            fps: 10,     // Frames per second
            qrbox: 250   // Size of the scanning box
        },
        onScanSuccess,
        onScanFailure
    )
    .catch(err => {
        console.error("Unable to start scanning", err);
        alert('Unable to start scanning. Make sure your camera is accessible.');
    });
}

// Function to fetch and display total water consumption
function fetchTotalWaterConsumption() {
    const userId = JSON.parse(localStorage.getItem('patientID'));
    fetch(baseURL + `/api/user-water/${userId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-water').innerText = `Total water consumed: ${data.total_ml_water} ml`;
        })
        .catch(error => console.error('Error fetching initial water data:', error));
}

// Fetch and display total water consumption at the loading of the page
fetchTotalWaterConsumption();

// Check if the camera permissions are available and ask for them if needed
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            // Camera is accessible, now initialize QR code scanner
            initQrCodeScanner();
        })
        .catch(function(err) {
            console.error('Camera permission denied:', err);
            alert('Camera access denied. Please allow the camera to scan QR codes or barcodes.');
        });
} else {
    alert('Camera not available or not supported in your browser.');
}