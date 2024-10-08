//Set role to patient
localStorage.setItem('role', JSON.stringify("Patient"));

// Base URL for the API if not declared
// import { baseURL } from './Scripts/config.js';


// // Simulate the position of the indicator on the scale
// const currentStatusBalance = document.getElementById('currentStatusBalance');
// const scaleContainer = document.querySelector('.scale-container');

// // Adjust the left position of the indicator
// currentStatusBalance.style.left = '65%'; // Change this percentage based on the current value

// Add a click event listener to the 'off' div
document.getElementById('balance').addEventListener('click', function() {
    // Redirect to another page
    window.location.href = "HomeScreen.html"; // Adjust the path to your desired page
});

// Function to fetch data from the API
async function fetchData(endpoint) {
    const response = await fetch(`${baseURL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

// Function to calculate fluid intake percentage
async function calculateFluidIntake() {
    const patientID = JSON.parse(localStorage.getItem('patientID')); // Use the patient ID


    // Fetch log data, nutrition data, and patient data from the API
    const [nutritionData, logData, patientData] = await Promise.all([
        fetchData(`/api/nutrition`),       // Fetch all nutrition values
        fetchData(`/api/logs?patient_id=${patientID}`), // Fetch logs for a specific patient
        fetchData(`/api/patients?patient_id=${patientID}`) // Fetch patient data
    ]);

    // Find the maximum fluid intake for the patient
    let maxFluidIntake = 0;
    patientData.forEach(row => {
    	if (row[1] === patientID) {
            maxFluidIntake = parseFloat(row[5]); // Assuming max amount is in the 3rd column
        }
    });

    // Calculate total fluid intake from Logs
    let totalIntake = 0;
    logData.forEach(row => {
    	if (row[1] === patientID) {
            const foodId = row[4]
            const food = nutritionData[foodId]
            totalIntake += parseFloat(food[7]); 
        }
    });

    // Calculate percentage of intake
    const intakePercentage = (totalIntake / maxFluidIntake) * 50;
    
    // Convert to string with '%' sign
    const intakePercentageStr = `${intakePercentage}%`;

    // Simulate the position of the indicator on the scale
	const currentStatusIntake = document.getElementById('currentStatusIntake');

	// Adjust the left position of the indicator
	currentStatusIntake.style.left = intakePercentageStr; // Change this percentage based on the current value
}

// Generate the fluid intake percentage on page load
window.onload = calculateFluidIntake;
