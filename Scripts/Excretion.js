function submitExcretion(category) {
    const amountInput = document.getElementById(`amount${capitalizeFirstLetter(category)}`);
    const amount = amountInput.value;
    amountInput.value = ""; // Clear the input field after submission

    const patient_id = JSON.parse(localStorage.getItem('patientID'));
    const role = JSON.parse(localStorage.getItem('role'));

    const input_user_id = (role === 'Patient') ? patient_id : JSON.parse(localStorage.getItem('employeeID'));

    const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
    const currentDate = new Date().toISOString().split('T')[0];

    // Send the adjusted data to the backend
    fetch(baseURL + '/api/add-logOut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input_user_id: input_user_id,
            patient_id: patient_id,
            time: currentTime,
            date: currentDate,
            category: category,
            amount: amount
        })
    })
    .then(data => {
      alert('Submitted!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Helper function to capitalize the first letter of the category
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
