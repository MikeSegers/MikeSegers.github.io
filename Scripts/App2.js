// Nutrition.js

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
        const [dish, calories, protein, carbs, fats] = lines[i].split(',');
        if (dish) { // Check if line is not empty
            result[dish.toLowerCase()] = {
                calories: parseFloat(calories),
                protein: parseFloat(protein),
                carbs: parseFloat(carbs),
                fats: parseFloat(fats),
            };
        }
    }
    return result;
}

// Function to display the nutritional information based on the dish
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
    } else {
        document.getElementById('dish-name').innerText = 'Dish not found';
    }
}

// Call the display function when the window loads
window.onload = displayNutritionInfo;
