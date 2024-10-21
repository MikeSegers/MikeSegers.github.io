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

async function calculateProgressIntake() {
    // Get the current time
    const currentTime = new Date();
    const currentHour = currentTime.getHours(); // Get the current hour (0-23)

    // Calculate hours past 6 AM
    let time = currentHour - 6;
    if (time < 0) {
        time = 0; // Accounting for times past midnight
    }

    const percentagePerHour = 100 / 18;
 
    const progressPercentage = Math.max(2, Math.min(98, percentagePerHour * time * 0.5)); // * 0.5 since 50% is perfect

    const progressIntake = document.getElementById('progressIntakePatient');
    const progress = document.getElementById('progress');
    progressIntake.style.left = `${progressPercentage}%`;
    progress.style.left = `${progressPercentage}%`;
}

async function calculateFluidIntakePatient() {
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

    document.getElementById('fluidIntakePatient').innerText = `${totalIntake.toFixed(1)} ml`;
    document.getElementById('maxFluidIntakePatient').innerText = `${maxFluidIntake.toFixed(1)} ml`;

    const currentStatusIntake = document.getElementById('currentStatusIntakePatient');
    currentStatusIntake.style.left = `${intakePercentage}%`;
}

async function calculateFluidIntakeNurse() {
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
        if (row.patient_id === ID && row.verified) {
            const foodId = row.nutrition_id;
            const amount = row.corrected_amount;
            const food = nutritionData[foodId - 1];
            totalIntake += parseFloat(food.water * amount);
        }
    });

    const intakePercentage = Math.max(2, Math.min(98,(totalIntake / maxFluidIntake) * 50));

    document.getElementById('fluidIntakeNurse').innerText = `${totalIntake.toFixed(1)} ml`;
    document.getElementById('maxFluidIntakeNurse').innerText = `${maxFluidIntake.toFixed(1)} ml`;

    const currentStatusIntake = document.getElementById('currentStatusIntakeNurse');
    currentStatusIntake.style.left = `${intakePercentage}%`;
}

async function calculateBalanceNurse() {
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
        if (row.patient_id === ID && row.verified) {
            const foodId = row.nutrition_id;
            const amount = row.corrected_amount;
            const food = nutritionData[foodId - 1];
            totalIntake += parseFloat(food.water * amount);
        }
    });

    let totalOuttake = 0;
    logOutData.forEach(row => {
        if (row.patient_id === ID && row.verified) {
            totalOuttake += parseFloat(row.amount);
        }
    });

    const balancePercentage = Math.max(2, Math.min(98, 50 + ((totalIntake - totalOuttake) / maxFluidIntake) * 50));

    document.getElementById('fluidExcretionNurse').innerText = `${totalOuttake.toFixed(1)} ml`;
    document.getElementById('fluidBalanceNurse').innerText = `${(totalIntake - totalOuttake).toFixed(1)} ml`;

    const currentStatusBalance = document.getElementById('currentStatusBalanceNurse');
    currentStatusBalance.style.left = `${balancePercentage}%`;
}


async function run() {
    const role = JSON.parse(localStorage.getItem('role'));

    // Get the content elements for patient and nurse
    const patientContent = document.getElementById('patientContent');
    const nurseContent = document.getElementById('nurseContent');

    // Show/Hide content based on the role
    if (role === 'Patient') {
        patientContent.style.display = 'block';
        nurseContent.style.display = 'none';
        calculateFluidIntakePatient();
    } else if (role === 'Nurse') {
        patientContent.style.display = 'none';
        nurseContent.style.display = 'block';
        calculateFluidIntakeNurse();
        calculateBalanceNurse();
    }
    calculateProgressIntake()
}

// Generate the fluid intake percentage on page load
window.onload = run;
