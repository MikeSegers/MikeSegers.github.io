// Function to get the dish parameter from the URL
function getDishParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('dish');
}

// Function to fetch nutrition data from the CSV file
async function fetchNutritionData() {
    const response = await fetch('../NutritionValues.csv'); // Adjust path if necessary
    const data = await response.text();
    return parseCSV(data);
}

// Function to parse the CSV data into an object
function parseCSV(data) {
    const lines = data.split('\n');
    const result = {};
    
    // Skip header and loop through each line
    for (let i = 1; i < lines.length; i++) {
        const [dish, calories, protein, carbs, fats, salt, water] = lines[i].split(',');
        if (dish) { // Check if line is not empty
            result[dish.toLowerCase()] = {
                calories: parseFloat(calories),
                protein: parseFloat(protein),
                carbs: parseFloat(carbs),
                fats: parseFloat(fats),
                salt: parseFloat(salt),
                water: parseFloat(water),
            };
        }
    }
    return result;
}

// Function to display the nutritional information
async function displayNutritionInfo() {
    const dish = getDishParameter();
    const nutritionData = await fetchNutritionData();
    const info = nutritionData[dish];

    if (info) {
        document.getElementById('dish-name').innerText = dish.charAt(0).toUpperCase() + dish.slice(1);
        document.getElementById('calories').innerText = info.calories;
        document.getElementById('protein').innerText = info.protein;
        document.getElementById('carbs').innerText = info.carbs;
        document.getElementById('fats').innerText = info.fats;
        document.getElementById('salt').innerText = info.salt;
        document.getElementById('water').innerText = info.water;

        // Set dish image
        const dishImage = document.getElementById('dish-image');
        dishImage.src = `../Images/Food/${dish.charAt(0).toUpperCase() + dish.slice(1)}.jpg`; // Assuming the image naming convention matches the dish names
        dishImage.alt = `${dish.charAt(0).toUpperCase() + dish.slice(1)} image`;

        // Check if a dish is already ordered
        if (localStorage.getItem('orderedDish') === dish) {
            showCancelOrderButton();
        }
    } else {
        document.getElementById('dish-name').innerText = 'Dish not found';
    }
}

// Function to handle dish ordering
function orderDish() {
    const dish = getDishParameter();
    localStorage.setItem('orderedDish', dish); // Save the ordered dish
    showCancelOrderButton(); // Switch button to "Cancel"
}

// Function to handle canceling an order
function cancelOrder() {
    localStorage.removeItem('orderedDish'); // Remove the order
    showOrderButton(); // Switch button back to "Order"
}

// Function to display the "Order This Dish" button
function showOrderButton() {
    const orderSection = document.getElementById('order-section');
    orderSection.innerHTML = `<button id="order-button" onclick="orderDish()">Order This Dish</button>`;
}

// Function to display the "Cancel Order" button
function showCancelOrderButton() {
    const orderSection = document.getElementById('order-section');
    orderSection.innerHTML = `<button id="cancel-button" onclick="cancelOrder()">Cancel Current Order</button>`;
}

// Call the display function when the window loads
window.onload = function() {
    displayNutritionInfo();

    // Check if any dish has already been ordered and update button
    const orderedDish = localStorage.getItem('orderedDish');
    const currentDish = getDishParameter();

    if (orderedDish && orderedDish !== currentDish) {
        // Capitalize the first letter of the ordered dish
        const orderedDishName = orderedDish.charAt(0).toUpperCase() + orderedDish.slice(1);
        
        // Show message informing the user which dish has already been ordered
        document.getElementById('order-section').innerHTML = 
        `<p style="text-align: center;">You have already ordered <strong>${orderedDishName}</strong>.</p>
        <p style="text-align: center;">Please cancel it first before ordering another dish.</p>`;

    }
};
