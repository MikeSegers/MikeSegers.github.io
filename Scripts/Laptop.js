// Function to fetch data from the API
async function fetchData(endpoint) {
    const response = await fetch(`${baseURL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

// Function to calculate fluid intake for the nurse
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

    const intakePercentage = Math.max(2, Math.min(98, (totalIntake / maxFluidIntake) * 50));

    document.getElementById('fluidIntakeNurse').innerText = `${totalIntake.toFixed(1)} ml`;
    document.getElementById('maxFluidIntakeNurse').innerText = `${maxFluidIntake.toFixed(1)} ml`;

    const currentStatusIntake = document.getElementById('currentStatusIntakeNurse');
    currentStatusIntake.style.left = `${intakePercentage}%`;
}

// Function to calculate balance for the nurse
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

// Function to render the patient list
async function renderPatients(patients) {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = ''; // Clear any existing content

    patients.forEach(patient => {
        // Only list patients with state 'active'
        if (patient.state === 'active') {
            const patientDiv = document.createElement('div');
            patientDiv.classList.add('patientCel');

            // Create a header for the patient
            const patientHeader = document.createElement('div');
            patientHeader.classList.add('patient-header');
            patientHeader.innerText = `Patient ID: ${patient.patient_id}, Name: ${patient.first_name} ${patient.last_name}`;
            patientDiv.appendChild(patientHeader);

            // Nurse specific section
            const nurseContent = document.createElement('div');
            nurseContent.id = 'nurseContent';
            nurseContent.classList.add('role-specific-content');

            nurseContent.innerHTML = `
                <h2 data-translate="verifiedStatus">Verified status:</h2>
                <div class="scale-container">
                    <div class="scale-segment red"></div>
                    <div class="scale-segment orange"></div>
                    <div class="scale-segment green"></div>
                    <div class="scale-segment orange"></div>
                    <div class="scale-segment red"></div>
                </div>
                <div class="scale-text">
                    <span class="left-text" data-translate="underhydrated">Underhydrated</span>
                    <span class="right-text" data-translate="overhydrated">Overhydrated</span>
                </div>
                <div class="indicator-container">
                    <div class="indicator" id="currentStatusBalanceNurse"></div>
                </div>
                <div class="scale-container">
                    <div class="scale-segment red"></div>
                    <div class="scale-segment orange"></div>
                    <div class="scale-segment green"></div>
                    <div class="scale-segment green"></div>
                    <div class="scale-segment green"></div>
                    <div class="scale-segment orange"></div>
                    <div class="scale-segment red"></div>
                    <div class="scale-segment red"></div>
                    <div class="scale-segment red"></div>
                    <div class="scale-segment red"></div>
                </div>
                <div class="scale-text">
                    <span class="left-text" data-translate="tooLittleIntake">Too little intake</span>
                    <span class="right-text" data-translate="tooMuchIntake">Too much intake</span>
                </div>
                <div class="indicator-container">
                    <div class="indicator" id="currentStatusIntakeNurse"></div>
                </div>
                <div class="fluid-stats">
                    <div class="fluid-row">
                        <span data-translate="fluidIntakeLabel">Fluid Intake:</span> <span id="fluidIntakeNurse">0 ml</span>
                    </div>
                    <div class="fluid-row">
                        <span data-translate="fluidExcretionLabel">Fluid Excretion:</span> <span id="fluidExcretionNurse">0 ml</span>
                    </div>
                    <div class="fluid-row">
                        <span data-translate="maxFluidIntakeLabel">Max Fluid Intake:</span> <span id="maxFluidIntakeNurse">0 ml</span>
                    </div>
                    <div class="fluid-row">
                        <span data-translate="balanceLabel">Balance:</span> <span id="fluidBalanceNurse">0 ml</span>
                    </div>
                </div>
            `;

            // Append the nurse content to the patientDiv
            patientDiv.appendChild(nurseContent);

            // Append the patientDiv to the patient list
            patientList.appendChild(patientDiv);

            // Call the calculation functions after rendering the patients
            calculateFluidIntakeNurse();
            calculateBalanceNurse();
        }
    });
}

// Function to load patients and render them
async function loadPatients() {
    try {
        const [patientData] = await Promise.all([
            fetchData(`/api/allPatients`),
        ]);
        renderPatients(patientData);
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

// Call the function to load and display patients when the page loads
window.onload = loadPatients;
