// Function to get the ID parameter from the URL
function getIdParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
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
        const [id, dish, calories, protein, carbs, fats, salt, water] = lines[i].split(',');
        if (id) { // Check if line is not empty
            result[id] = {
                dish: dish.toLowerCase(),
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
    const id = getIdParameter();
    const nutritionData = await fetchNutritionData();
    const info = nutritionData[id];

    if (info) {
        document.getElementById('dish-name').innerText = info.dish.charAt(0).toUpperCase() + info.dish.slice(1);
        document.getElementById('calories').innerText = info.calories;
        document.getElementById('protein').innerText = info.protein;
        document.getElementById('carbs').innerText = info.carbs;
        document.getElementById('fats').innerText = info.fats;
        document.getElementById('salt').innerText = info.salt;
        document.getElementById('water').innerText = info.water;

        // Set dish image
        const dishImage = document.getElementById('dish-image');
        dishImage.src = `../Images/Food/${info.dish.charAt(0).toUpperCase() + info.dish.slice(1)}.jpg`; // Assuming the image naming convention matches the dish names
        dishImage.alt = `${info.dish.charAt(0).toUpperCase() + info.dish.slice(1)} image`;

        // Check if a dish is already ordered
        if (localStorage.getItem('orderedDish') === id) {
            showCancelOrderButton();
        }
    } else {
        document.getElementById('dish-name').innerText = 'Dish not found';
    }
}

// Function to handle dish ordering
function orderDish() {
    const now = new Date();
    const currentHours = now.getHours();

    // Check if it's restricted time (between 15:00 and 6:00)
    if (currentHours >= 15 || currentHours < 6) {
        const orderedDish = localStorage.getItem('orderedDish');
        if (orderedDish) {
            alert(`You cannot order food between 15h-6h. You have already ordered: ${orderedDish}.`);
        } else {
            alert("You cannot order food between 15h-6h. You did not select anything in time so a random meal will be provided.");
        }
        return; // Exit the function if ordering is not allowed
    }

    // Proceed with ordering if within allowed time
    const id = getIdParameter();
    localStorage.setItem('orderedDish', id); // Save the ordered dish by ID
    showCancelOrderButton(); // Switch button to "Cancel"
}

// Function to handle canceling an order
function cancelOrder() {
    const now = new Date();
    const currentHours = now.getHours();

    // Check if it's restricted time (between 15:00 and 6:00)
    if (currentHours >= 15 || currentHours < 6) {
        const orderedDish = localStorage.getItem('orderedDish');
        if (orderedDish) {
            alert(`You cannot cancel an order between 15h-6h. You have ordered: ${orderedDish}.`);
        } else {
            alert("You cannot cancel an order between 15h-6h. You did not select anything in time so a random meal will be provided.");
        }
        return; // Exit the function if ordering is not allowed
    }

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
