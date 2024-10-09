const tbody = document.querySelector('#foodTable tbody');

// Base URL for the API if not declared
// import { baseURL } from './config.js';

// Function to load data from API
async function loadData(endpoint) {
    const response = await fetch(`${baseURL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

// Function to parse log data and nutrition data
async function generateFoodTable() {
    const ID = JSON.parse(localStorage.getItem('patientID')); // Assuming patientID is set

    // Fetch log data and nutrition data from the API
    const [logData, nutritionData] = await Promise.all([
        loadData(`/api/logs?patient_id=${ID}`),
        loadData('/api/nutrition')
    ]);

    if (!logData || !nutritionData) {
        console.error('Error fetching data');
        return;
    }

    const nutritionMap = {};
    nutritionData.forEach(row => {
        const {id, dish, calories, protein, carbs, fats, salt, water} = row;
        nutritionMap[id] = { dish, calories: parseFloat(calories), protein: parseFloat(protein), carbs: parseFloat(carbs), fats: parseFloat(fats), salt: parseFloat(salt), water: parseFloat(water) };
    });

    const overallTotal = { calories: 0, protein: 0, carbs: 0, fats: 0, salts: 0, water: 0 };

    const foodData = {};
    
    logData.forEach(row => {
        const {input_user_id, patient_id, time, date, nutrition_id, category, corrected_amount} = row;

        if (patient_id == ID) { // Filter by patient ID
            if (!foodData[category]) {
                foodData[category] = [];
            }

            const nutritionInfo = nutritionMap[nutrition_id];
            if (nutritionInfo) {
                foodData[category].push({...nutritionInfo, corrected_amount});
                // Update overall totals
                overallTotal.calories += (nutritionInfo.calories * corrected_amount);
                overallTotal.protein += (nutritionInfo.protein * corrected_amount);
                overallTotal.carbs += (nutritionInfo.carbs * corrected_amount);
                overallTotal.fats += (nutritionInfo.fats * corrected_amount);
                overallTotal.salts += (nutritionInfo.salt * corrected_amount);
                overallTotal.water += (nutritionInfo.water * corrected_amount);
            }
        }
    });

    const predefinedCategories = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks'];

    predefinedCategories.forEach(category => {
        const items = foodData[category] || []; // Get items or use an empty array if the category is not in the log
        let categoryTotal = { calories: 0, protein: 0, carbs: 0, fats: 0, salts: 0, water: 0 };

        // Create a combined category row that sums up and is clickable
        const categoryRow = document.createElement('tr');
        categoryRow.classList.add('category-row');
        categoryRow.innerHTML = `<td><strong>${capitalizeFirstLetter(category)}</strong></td>
            <td>${(categoryTotal.calories).toFixed(1)}</td>
            <td>${(categoryTotal.protein).toFixed(1)}</td>
            <td>${(categoryTotal.carbs).toFixed(1)}</td>
            <td>${(categoryTotal.fats).toFixed(1)}</td>
            <td>${(categoryTotal.salts).toFixed(1)}</td>
            <td>${(categoryTotal.water).toFixed(1)}</td>`;
        tbody.appendChild(categoryRow);

        // Event listener to toggle food items
        categoryRow.addEventListener('click', () => {
            const hiddenRows = Array.from(tbody.querySelectorAll(`.items-row[data-parent="${category}"]`));
            hiddenRows.forEach(row => row.classList.toggle('hidden'));
        });

        // Create item rows for the category (if any items exist)
        if (items.length > 0) {
            items.forEach(item => {
                const itemRow = document.createElement('tr');
                itemRow.classList.add('items-row', 'hidden');
                itemRow.setAttribute('data-parent', category);
                itemRow.innerHTML = `<td style="padding-left: 20px; font-style: italic;">${item.dish}</td>
                    <td style="padding-left: 20px; font-style: italic;">${(item.calories * item.corrected_amount).toFixed(1)}</td>
                    <td style="padding-left: 20px; font-style: italic;">${(item.protein * item.corrected_amount).toFixed(1)}</td>
                    <td style="padding-left: 20px; font-style: italic;">${(item.carbs * item.corrected_amount).toFixed(1)}</td>
                    <td style="padding-left: 20px; font-style: italic;">${(item.fats * item.corrected_amount).toFixed(1)}</td>
                    <td style="padding-left: 20px; font-style: italic;">${(item.salt * item.corrected_amount).toFixed(1)}</td>
                    <td style="padding-left: 20px; font-style: italic;">${(item.water * item.corrected_amount).toFixed(1)}</td>`;
                tbody.appendChild(itemRow);

                // Sum up category values, applying the corrected_amount
                categoryTotal.calories += item.calories * item.corrected_amount;
                categoryTotal.protein += item.protein * item.corrected_amount;
                categoryTotal.carbs += item.carbs * item.corrected_amount;
                categoryTotal.fats += item.fats * item.corrected_amount;
                categoryTotal.salts += item.salt * item.corrected_amount;
                categoryTotal.water += item.water * item.corrected_amount;
            });
        }

        // Update the category row with the correct totals (if there were items)
        categoryRow.innerHTML = `<td><strong>${capitalizeFirstLetter(category)}</strong></td>
            <td>${(categoryTotal.calories).toFixed(1)}</td>
            <td>${(categoryTotal.protein).toFixed(1)}</td>
            <td>${(categoryTotal.carbs).toFixed(1)}</td>
            <td>${(categoryTotal.fats).toFixed(1)}</td>
            <td>${(categoryTotal.salts).toFixed(1)}</td>
            <td>${(categoryTotal.water).toFixed(1)}</td>`;
    });

    // Create the overall total row at the top without bold formatting
    const overallTotalRow = document.createElement('tr');
    overallTotalRow.innerHTML = `<td style="border-bottom: 3px solid black;"><strong>Overall</strong></td>
        <td style="border-bottom: 3px solid black;">${(overallTotal.calories).toFixed(1)}</td>
        <td style="border-bottom: 3px solid black;">${(overallTotal.protein).toFixed(1)}</td>
        <td style="border-bottom: 3px solid black;">${(overallTotal.carbs).toFixed(1)}</td>
        <td style="border-bottom: 3px solid black;">${(overallTotal.fats).toFixed(1)}</td>
        <td style="border-bottom: 3px solid black;">${(overallTotal.salts).toFixed(1)}</td>
        <td style="border-bottom: 3px solid black;">${(overallTotal.water).toFixed(1)}</td>`;
    tbody.prepend(overallTotalRow);
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Generate the food table on page load
window.onload = generateFoodTable;
