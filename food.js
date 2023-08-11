// Constants for API
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const LOOKUP_MEAL_ENDPOINT = 'lookup.php?i=';

// Function to fetch data from API
async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display meal details
function displayMealDetails(mealId) {
  const mealNameElement = document.getElementById('mealName');
  const mealImageElement = document.getElementById('mealImage');
  const mealInstructionsElement = document.getElementById('mealInstructions');

  fetchAPI(API_BASE_URL + LOOKUP_MEAL_ENDPOINT + mealId)
    .then(data => {
      if (data.meals) {
       const meal = data.meals[0];
      
        mealNameElement.textContent = meal.strMeal;
        mealImageElement.src = meal.strMealThumb;
        mealInstructionsElement.textContent = meal.strInstructions;
      }
    });
}

// Get mealId from URL query parameters
const params = new URLSearchParams(window.location.search);
//window.location.search is a built-in property that returns the query string (the portion of the URL after the ? symbol) of the current page URL.
const mealId = params.get('id');

// Display meal details on page load
window.addEventListener('load', () => {
  displayMealDetails(mealId);
});