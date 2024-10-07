//Set role to patient
localStorage.setItem('role', JSON.stringify("Patient"));

// Simulate the position of the indicator on the scale
const currentStatusBalance = document.getElementById('currentStatusBalance');
const scaleContainer = document.querySelector('.scale-container');

// Adjust the left position of the indicator
currentStatusBalance.style.left = '65%'; // Change this percentage based on the current value

// Add a click event listener to the 'off' div
document.getElementById('balance').addEventListener('click', function() {
    // Redirect to another page
    window.location.href = "HomeScreen.html"; // Adjust the path to your desired page
});

// Function to fetch CSV data and parse it
async function fetchCSV(url) {
	const response = await fetch(url);
	const text = await response.text();
	const rows = text.trim().split('\n').map(row => row.split(','));
	return rows;
}

// Function to calculate fluid intake percentage
async function calculateFluidIntake() {
    // Fetch the log and patient CSV files
    const nutritionData = await fetchCSV('../NutritionValues.csv');
    const logData = await fetchCSV('../Log.csv');
    const patientData = await fetchCSV('../Patients.csv');

    const patientID = window.patientID; // Use the patient ID from the window object

    // Find the maximum fluid intake for the patient
    let maxFluidIntake = 0;
    patientData.forEach(row => {
    	if (row[1] === patientID) {
            maxFluidIntake = parseFloat(row[5]); // Assuming max amount is in the 3rd column
        }
    });

    // Calculate total fluid intake from log.csv
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
