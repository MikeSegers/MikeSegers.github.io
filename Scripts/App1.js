// Mock data for different food categories
const foodData = {
    lunch: [
        { item: "Chicken Sandwich", calories: 250, protein: 20, carbs: 30, fats: 10, salts: 1.5, water: 200 },
        { item: "Water", calories: 0, protein: 0, carbs: 0, fats: 0, salts: 0, water: 150 }
    ],
    dinner: [
        { item: "Pasta", calories: 200, protein: 8, carbs: 40, fats: 5, salts: 0.7, water: 300 },
        { item: "Salad", calories: 50, protein: 2, carbs: 10, fats: 1, salts: 0.2, water: 150 }
    ],
    snacks: [
        { item: "Apple", calories: 95, protein: 0.5, carbs: 25, fats: 0.3, salts: 0.01, water: 200 },
        { item: "Yogurt", calories: 100, protein: 6, carbs: 15, fats: 4, salts: 0.1, water: 100 }
    ],
    drinks: [
        { item: "Orange Juice", calories: 45, protein: 0.7, carbs: 10, fats: 0.2, salts: 0.01, water: 100 },
        { item: "Soda", calories: 150, protein: 0, carbs: 39, fats: 0, salts: 0.05, water: 250 }
    ]
};

const tbody = document.querySelector('#foodTable tbody');

// Function to generate the table rows
function generateFoodTable() {
    let overallTotal = { calories: 0, protein: 0, carbs: 0, fats: 0, salts: 0, water: 0 };

    for (const category in foodData) {
        const items = foodData[category];
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

        // Create item rows for the category
        items.forEach(item => {
            const itemRow = document.createElement('tr');
            itemRow.classList.add('items-row', 'hidden');
            itemRow.setAttribute('data-parent', category);
            itemRow.innerHTML = `<td style="padding-left: 20px; font-style: italic;">${item.item}</td>
                <td style="padding-left: 20px; font-style: italic;">${(item.calories).toFixed(1)}</td>
                <td style="padding-left: 20px; font-style: italic;">${(item.protein).toFixed(1)}</td>
                <td style="padding-left: 20px; font-style: italic;">${(item.carbs).toFixed(1)}</td>
                <td style="padding-left: 20px; font-style: italic;">${(item.fats).toFixed(1)}</td>
                <td style="padding-left: 20px; font-style: italic;">${(item.salts).toFixed(1)}</td>
                <td style="padding-left: 20px; font-style: italic;">${(item.water).toFixed(1)}</td>`;
            tbody.appendChild(itemRow);

            // Sum up category values
            categoryTotal.calories += item.calories;
            categoryTotal.protein += item.protein;
            categoryTotal.carbs += item.carbs;
            categoryTotal.fats += item.fats;
            categoryTotal.salts += item.salts;
            categoryTotal.water += item.water;

            // Sum up overall totals
            overallTotal.calories += item.calories;
            overallTotal.protein += item.protein;
            overallTotal.carbs += item.carbs;
            overallTotal.fats += item.fats;
            overallTotal.salts += item.salts;
            overallTotal.water += item.water;
        });

        // Update the category row with the correct totals
        categoryRow.innerHTML = `<td><strong>${capitalizeFirstLetter(category)}</strong></td>
            <td>${(categoryTotal.calories).toFixed(1)}</td>
            <td>${(categoryTotal.protein).toFixed(1)}</td>
            <td>${(categoryTotal.carbs).toFixed(1)}</td>
            <td>${(categoryTotal.fats).toFixed(1)}</td>
            <td>${(categoryTotal.salts).toFixed(1)}</td>
            <td>${(categoryTotal.water).toFixed(1)}</td>`;
    }

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
