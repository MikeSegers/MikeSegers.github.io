// Function to load data from API
async function loadData(endpoint) {
  const response = await fetch(`${baseURL}${endpoint}`);
  if (!response.ok) {
   throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);

 }
 const data = await response.json();

 return data;
}

async function fetchNutritionData() {
  const ID = JSON.parse(localStorage.getItem('patientID'));
  const role = JSON.parse(localStorage.getItem('role'));

  // Fetch nutrition data from the API
  const [nutritionData] = await Promise.all([
  	loadData('/api/nutrition')
  	]);

  if (!nutritionData) {
  	console.error('Error fetching data');
  	return;
  }

  const nutritionTableBody = document.getElementById('nutritionData');

  // Populate the table with nutrition data
  nutritionData.forEach(item => {
  	const row = document.createElement('tr');

    if(item.protected == 0 || role == 'Nurse') {
     row.innerHTML = `
     <td><input type="text" value="${item.dish}" readonly /></td>
     <td><input type="text" value="${item.water}" readonly /></td>
     <td><input type="number" class="adjust-amount" id="amount-${item.id}" placeholder="1" /></td>
     <td>
     <select id="category-${item.id}">
     <option value="breakfast">Breakfast</option>
     <option value="lunch">Lunch</option>
     <option value="dinner">Dinner</option>
     <option value="snacks">Snacks</option>
     <option value="drinks">Drinks</option>
     </select>
     </td>
     <td><button onclick="submitAdjustedAmount(${item.id})">Submit</button></td>
     `;

     nutritionTableBody.appendChild(row);
   }
 });
}

function submitAdjustedAmount(id) {
 const amountInput = document.getElementById(`amount-${id}`);
 const adjustedAmount = amountInput.value || 1;
  const category = document.getElementById(`category-${id}`).value; // Get the selected category

  const patient_id = JSON.parse(localStorage.getItem('patientID'));
  const role = JSON.parse(localStorage.getItem('role'));

  if (role == 'Nurse') {
    isNurse = true;
  } else {
    isNurse = false;
  }

  const input_user_id = (role === 'Patient') ? patient_id : JSON.parse(localStorage.getItem('employeeID'));

  const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
  const currentDate = new Date().toISOString().split('T')[0];

  // Send the adjusted data to the backend
  fetch(baseURL + '/api/add-log', {
  	method: 'POST',
  	headers: { 'Content-Type': 'application/json' },
  	body: JSON.stringify({
  		input_user_id: input_user_id, 
  		patient_id: patient_id,
  		time: currentTime,
  		date: currentDate,
  		nutrition_id: id,
  		category: category,
  		corrected_amount: adjustedAmount,
      verified: isNurse
    })
  })
  .then(data => {
    alert('Submitted!');
  })
  .catch(error => {
  	console.error('Error:', error);
  });

}

// Call the function to fetch and display data on page load
fetchNutritionData();
