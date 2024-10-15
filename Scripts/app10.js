

document.addEventListener('DOMContentLoaded', async () => {
    const role = JSON.parse(localStorage.getItem('role'));
    const patientID = JSON.parse(localStorage.getItem('patientID'));

// If the role is "Patient", show the access denied message and hide the tables
if (role === 'Patient') {
    document.getElementById('accessDeniedMessage').style.display = 'block';
    document.getElementById('verificationTable').style.display = 'none';
    document.getElementById('logTable').style.display = 'none';
    document.getElementById('logsOutTable').style.display = 'none';
    return; // Exit early, as patients should not see the tables
}

// If the role is "Nurse", show the tables
if (role === 'Nurse') {
    document.getElementById('accessDeniedMessage').style.display = 'none';
    document.getElementById('verificationTable').style.display = 'block';
    document.getElementById('logTable').style.display = 'block';
    document.getElementById('logsOutTable').style.display = 'block';

    // Helper function to fetch data
    async function loadData(endpoint) {
        const response = await fetch(`${baseURL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
        }
        return response.json();
    }

    try {
        // Load Logs and NutritionValues data
        const [logData, nutritionData, logsOutData] = await Promise.all([
            loadData(`/api/logs?patient_id=${patientID}`),
            loadData('/api/nutrition'),
            loadData(`/api/logsOut?patient_id=${patientID}`)
            ]);

        const nutritionMap = {};
        nutritionData.forEach(nutrition => {
            nutritionMap[nutrition.id] = nutrition.dish;
        });

        // Populate Logs Table
        const verificationTableBody = document.querySelector('#verificationTable tbody');
        const logTableBody = document.querySelector('#logTable tbody');
        logData.forEach(log => {

            const row = document.createElement('tr');

            const dish = nutritionMap[log.nutrition_id] || 'Unknown Dish';
            const correctedAmount = log.corrected_amount || 0;

            if (log.verified) {
                row.innerHTML = `
                <td>${dish}</td>
                <td><input type="number" value="${correctedAmount}" data-log-id="${log.id}"></td>
                <td>
                <button class="submit-btn-in" data-log-id="${log.id}">Submit</button>
                <button class="delete-btn-in" data-log-id="${log.id}">Delete</button>
                </td>
                `;

                logTableBody.appendChild(row);
            } else {
                row.innerHTML = `
                <td>${dish}</td>
                <td><input type="number" value="${correctedAmount}" data-log-id="${log.id}"></td>
                <td>
                <button class="verify-btn-in" data-log-id="${log.id}">Verify</button>
                <button class="delete-btn-in" data-log-id="${log.id}">Delete</button>
                </td>
                `;
                verificationTableBody.appendChild(row);
            }
        });

        // Populate LogsOut Table
        const logsOutTableBody = document.querySelector('#logsOutTable tbody');
        logsOutData.forEach(logOut => {
            const row = document.createElement('tr');

            const category = logOut.category || 'Unknown Category';
            const amount = logOut.amount || 0;

            if (logOut.verified) {
                row.innerHTML = `
                <td>${category}</td>
                <td><input type="number" value="${amount}" data-logsOut-id="${logOut.id}"></td>
                <td>
                <button class="submit-btn-out" data-logsOut-id="${logOut.id}">Submit</button>
                <button class="delete-btn-out" data-logsOut-id="${logOut.id}">Delete</button>
                </td>
                `;
                logsOutTableBody.appendChild(row);
            } else {
                row.innerHTML = `
                <td>${category}</td>
                <td><input type="number" value="${amount}" data-logsOut-id="${logOut.id}"></td>
                <td>
                <button class="verify-btn-out" data-logsOut-id="${logOut.id}">Verify</button>
                <button class="delete-btn-out" data-logsOut-id="${logOut.id}">Delete</button>
                </td>
                `;
                verificationTableBody.appendChild(row);
            }
        });

        // Event listener for submit and delete buttons for logs
        document.body.addEventListener('click', async (event) => {
            if (event.target.classList.contains('submit-btn-in')) {
                const logID = event.target.dataset.logId;
                const newAmount = event.target.parentElement.previousElementSibling.querySelector('input').value;

                // Send updated data to the server
                try {
                    await fetch(`${baseURL}/api/updateLog`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ log_id: logID, corrected_amount: newAmount })
                    });
                    alert('Log updated successfully!');
                } catch (error) {
                    console.error('Error updating log:', error);
                }
            }

            // Handle delete button for logs
            if (event.target.classList.contains('delete-btn-in')) {
                const logID = event.target.dataset.logId;

                try {
                    await fetch(`${baseURL}/api/deleteLog`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ log_id: logID })
                    });
                    alert('Log deleted successfully!');
                    event.target.parentElement.parentElement.remove(); // Remove the row from the table
                } catch (error) {
                    console.error('Error deleting log:', error);
                }
            }

            if (event.target.classList.contains('verify-btn-in')) {
                const logID = event.target.dataset.logId;

                // Send updated data to the server
                try {
                    await fetch(`${baseURL}/api/verifyLog`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ log_id: logID })
                    });
                    alert('Log verified successfully!');
                } catch (error) {
                    console.error('Error verified log:', error);
                }
            }

            // Event listener for submit and delete buttons for logsOut
            if (event.target.classList.contains('submit-btn-out')) {
                const logsOutID = event.target.dataset.logsOutId;
                const newAmount = event.target.parentElement.previousElementSibling.querySelector('input').value;

                // Send updated data to the server
                try {
                    await fetch(`${baseURL}/api/updateLogOut`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ logsOut_id: logsOutID, corrected_amount: newAmount })
                    });
                    alert('LogOut updated successfully!');
                } catch (error) {
                    console.error('Error updating logOut:', error);
                }
            }

            // Handle delete button for logsOut
            if (event.target.classList.contains('delete-btn-out')) {
                const logsOutID = event.target.dataset.logsOutId;

                try {
                    await fetch(`${baseURL}/api/deleteLogOut`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ logsOut_id: logsOutID })
                    });
                    alert('LogOut deleted successfully!');
                    event.target.parentElement.parentElement.remove(); // Remove the row from the table
                } catch (error) {
                    console.error('Error deleting logOut:', error);
                }
            }

            // Event listener for submit and delete buttons for logsOut
            if (event.target.classList.contains('verify-btn-out')) {
                const logsOutID = event.target.dataset.logsOutId;

                // Send updated data to the server
                try {
                    await fetch(`${baseURL}/api/verifyLogOut`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ logsOut_id: logsOutID })
                    });
                    alert('LogOut verified successfully!');
                } catch (error) {
                    console.error('Error verified logOut:', error);
                }
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
});
