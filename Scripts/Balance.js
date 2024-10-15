//Set role to patient
localStorage.setItem('role', JSON.stringify("Patient"));

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

async function calculateFluidIntake() {
    const ID = JSON.parse(localStorage.getItem('patientID'));

    const [nutritionData, logData, patientData] = await Promise.all([
        fetchData(`/api/nutrition`),
        fetchData(`/api/logs?patient_id=${ID}`),
        fetchData(`/api/patients?patient_id=${ID}`)
    ]);

    let maxFluidIntake = 0;
    patientData.forEach(row => {
        if (row.patient_id === ID) {
            maxFluidIntake = parseFloat(row.max_fluid_intake);
        }
    });

    let totalIntake = 0;
    logData.forEach(row => {
        if (row.patient_id === ID) {
            const foodId = row.nutrition_id;
            const amount = row.corrected_amount;
            const food = nutritionData[foodId - 1];
            totalIntake += parseFloat(food.water * amount);
        }
    });

    const intakePercentage = Math.max(2, Math.min(98,(totalIntake / maxFluidIntake) * 50));

    console.log('test');
    document.getElementById('fluidIntake').innerText = `${totalIntake.toFixed(1)} ml`;
    document.getElementById('maxFluidIntake').innerText = `${maxFluidIntake.toFixed(1)} ml`;

    const currentStatusIntake = document.getElementById('currentStatusIntake');
    currentStatusIntake.style.left = `${intakePercentage}%`;
}

async function calculateBalance() {
    const ID = JSON.parse(localStorage.getItem('patientID'));

    const [nutritionData, logData, logOutData, patientData] = await Promise.all([
        fetchData(`/api/nutrition`),
        fetchData(`/api/logs?patient_id=${ID}`),
        fetchData(`/api/logsOut?patient_id=${ID}`),
        fetchData(`/api/patients?patient_id=${ID}`)
    ]);

    let maxFluidIntake = 0;
    patientData.forEach(row => {
        if (row.patient_id === ID) {
            maxFluidIntake = parseFloat(row.max_fluid_intake);
        }
    });

    let totalIntake = 0;
    logData.forEach(row => {
        if (row.patient_id === ID) {
            const foodId = row.nutrition_id;
            const amount = row.corrected_amount;
            const food = nutritionData[foodId - 1];
            totalIntake += parseFloat(food.water * amount);
        }
    });

    let totalOuttake = 0;
    logOutData.forEach(row => {
        if (row.patient_id === ID) {
            totalOuttake += parseFloat(row.amount);
        }
    });

    const balancePercentage = Math.max(2, Math.min(98, 50 + ((totalIntake - totalOuttake) / maxFluidIntake) * 50));

    document.getElementById('fluidExcretion').innerText = `${totalOuttake.toFixed(1)} ml`;
    document.getElementById('fluidBalance').innerText = `${(totalIntake - totalOuttake).toFixed(1)} ml`;

    const currentStatusBalance = document.getElementById('currentStatusBalance');
    currentStatusBalance.style.left = `${balancePercentage}%`;
}


async function run() {
    calculateFluidIntake();
    calculateBalance();
}

// Generate the fluid intake percentage on page load
window.onload = run;
