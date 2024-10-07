localStorage.setItem('roomNumber', JSON.stringify(112));
const roomNumber = JSON.parse(localStorage.getItem('roomNumber'));

// Fetch patient data from CSV
async function getPatientData(roomNumber) {
    const response = await fetch('../Patients.csv');
    const data = await response.text();
    
    const lines = data.split('\n');
    const headers = lines[0].split(',');

    // Find the column indices
    const roomIndex = headers.indexOf('roomnumber');
    const idIndex = headers.indexOf('patient_id');
    const firstNameIndex = headers.indexOf('first_name');
    const lastNameIndex = headers.indexOf('last_name');
    const dateOfBirthIndex = headers.indexOf('date_of_birth');
    const maxFluidIntakeIndex = headers.indexOf('max_fluid_intake');

    // Iterate over the rows to find the correct patient
    for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(',');

        if (fields[roomIndex] == roomNumber) {
            window.patientID = fields[idIndex];
            window.patientName = fields[firstNameIndex] + ' ' + fields[lastNameIndex];

            // Display the patient information
            document.getElementById('patientID').textContent = 'ID: ' + window.patientID;
            document.getElementById('patientName').textContent = 'Name: ' + window.patientName;
            break;
        }
    }
}

// Call the function with the hardcoded room number
getPatientData(roomNumber);
