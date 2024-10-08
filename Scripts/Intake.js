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
        
        row.innerHTML = `
            <td><input type="text" value="${item.dish}" readonly /></td>
            <td><input type="text" value="${item.water}" readonly /></td>
            <td><input type="number" class="adjust-amount" id="amount-${item.id}" placeholder="1" /></td>
            <td><button onclick="submitAdjustedAmount(${item.id})">Submit</button></td>
        `;
        
        nutritionTableBody.appendChild(row);
    });
}

function submitAdjustedAmount(id) {
    const amountInput = document.getElementById(`amount-${id}`);
    const adjustedAmount = amountInput.value;

    if (!adjustedAmount) {
    	adjustedAmount = 1
    }
    
    // Handle the adjusted amount submission logic here
    console.log(`Submitted adjusted amount for item ${id}: ${adjustedAmount}`);
}

// Call the function to fetch and display data on page load
fetchNutritionData();
