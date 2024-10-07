localStorage.setItem('roomNumber', JSON.stringify(112));
const roomNumber = JSON.parse(localStorage.getItem('roomNumber'));

// Base URL for the API if not declared
// import { baseURL } from './Scripts/config.js';

// Fetch patient data from database
async function getPatientData(roomNumber) {
    try {
        const response = await fetch(`${baseURL}/api/roomnumber?roomnumber=${roomNumber}&state=active`);
        if (!response.ok) {
            throw new Error(`Error fetching patient data: ${response.statusText}`);
        }

        const patients = await response.json();

        if (patients.length > 0) {
            const patient = patients[0]; // Assuming one active patient per room
            window.patientID = patient.patient_id;
            window.patientName = `${patient.first_name} ${patient.last_name}`;

            // Display the patient information
            document.getElementById('patientID').textContent = 'ID: ' + window.patientID;
            document.getElementById('patientName').textContent = 'Name: ' + window.patientName;
        } else {
            console.error('No active patient found in this room.');
        }
    } catch (error) {
        console.error('Error fetching patient data:', error);
    }
}

// Call the function with the hardcoded room number
getPatientData(roomNumber);
