// Generate a dynamic session token
let sessionToken = Math.random().toString(36).substr(2, 4);  // Example session token
console.log("Generated session token:", sessionToken);

// Generate the QR code with the session token embedded
let qrcode = new QRCode(document.getElementById("qrcode"), {
    text: sessionToken,
    width: 128,
    height: 128,
});

// Display the session token text below the QR code
document.getElementById("token-display").innerText = `Token: ${sessionToken}`;

// Check the role on page load
document.addEventListener("DOMContentLoaded", () => {
    const role = JSON.parse(localStorage.getItem('role'));
    if (role === "Nurse") {
        document.getElementById("logout-section").style.display = "block"; // Show logout section
    }
});

// Simulate the back-end verification when the phone sends the scanned QR
async function verifyToken(scannedToken) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (scannedToken === sessionToken) {
                localStorage.setItem('role', JSON.stringify("Nurse"));

                localStorage.setItem('employeeID', JSON.stringify(2)); // SET TO NURSE ID WHO LOGS IN

                document.getElementById("logout-section").style.display = "block"; // Show logout section
                resolve("Login successful! Token: " + scannedToken);
            } else {
                reject("Invalid token.");
            }
        }, 1000);
    });
}

// Simulate scanning the QR code by entering the scanned token
function mockScan(scannedToken) {
    verifyToken(scannedToken)
        .then(message => {
            document.getElementById("login-status").innerText = message;
            document.getElementById("login-status").style.color = 'green';
        })
        .catch(error => {
            document.getElementById("login-status").innerText = error;
            document.getElementById("login-status").style.color = 'red';
        });
}

// Event listener for simulating a scan
document.getElementById("qrcode").addEventListener('click', () => {
    localStorage.setItem('role', JSON.stringify("Nurse"));

    localStorage.setItem('employeeID', JSON.stringify(2)); // SET TO NURSE ID WHO LOGS IN

    document.getElementById("logout-section").style.display = "block"; // Show logout section
    resolve("Login successful! Token: " + scannedToken);

    // const scannedToken = prompt("Simulate a scan: Enter the token you scanned"); // Simulate scan input
    // if (scannedToken) {
    //     mockScan(scannedToken);
    // }
});

// Logout function
document.getElementById("logout-button").addEventListener('click', () => {
    localStorage.setItem('role', JSON.stringify("Patient")); // Set role to Patient
    document.getElementById("logout-section").style.display = "none"; // Hide logout section
    document.getElementById("login-status").innerText = "You have logged out.";
    document.getElementById("login-status").style.color = 'blue';

    // Set a timeout to redirect after 3 seconds
    setTimeout(() => {
        window.location.href = '../HomeScreen.html'; // Redirect to the desired page
    }, 3000); // 3000 milliseconds = 3 seconds
});

