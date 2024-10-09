function submitUrine() {
    const amountInput = document.getElementById(`amountUrine`);
    const amount = amountInput.value
    const category = 'urine'

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
    .then(response => {
	    return response.json(); // Attempt to parse it as JSON
	})
    .then(data => {
    })
    .catch(error => {
    	console.error('Error:', error);
    });
}

function submitDiarrhea() {
    const amountInput = document.getElementById(`amountDiarrhea`);
    const amount = amountInput.value
    const category = 'diarrhea'

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
    .then(response => {
      return response.json(); // Attempt to parse it as JSON
  })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function submitVomit() {
    const amountInput = document.getElementById(`amountVomit`);
    const amount = amountInput.value
    const category = 'vomit'

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
    .then(response => {
      return response.json(); // Attempt to parse it as JSON
  })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function submitBlood() {
    const amountInput = document.getElementById(`amountBlood`);
    const amount = amountInput.value
    const category = 'blood'

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
    .then(response => {
      return response.json(); // Attempt to parse it as JSON
  })
    .then(data => {
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
