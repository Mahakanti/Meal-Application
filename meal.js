// Constants for API
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
//This constant holds the base URL of the API, which is the starting part of the API URL that remains constant for all requests.
const SEARCH_MEAL_ENDPOINT = 'search.php?s=';
// we are specifically interested in searching for meals by name, so the endpoint 'search.php?s=' is used.
// Variables
let favoriteMeals = [];

// Function to fetch data from API
async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    //It takes the url parameter, which represents the URL of the API endpoint we want to fetch data from.
    const data = await response.json();
    //The response.json() method returns a promise that resolves with the JSON data extracted from the response.
    return data;// when you call fetchAPI(url) from another part of the code, you can use the returned data directly or handle it further as needed.
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display search results
function displaySearchResults(searchTerm) {
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = '';
  favoritesContainer.innerHTML = '';
//Before displaying the new search results, the content of the searchResultsDiv container is cleared to avoid duplicate entries when the user types a new search term.
 //If the search term is not empty, we will proceed with fetching and displaying the search results. 
// smart search
 if (searchTerm.trim().length > 0) {
    fetchAPI(API_BASE_URL + SEARCH_MEAL_ENDPOINT + searchTerm)
      .then(data => {//'then' takes a callback function as an argument, which will be executed once the data is available.
        if (data.meals) {
           // Store search results in localStorage
           localStorage.setItem('searchResults', JSON.stringify(data.meals));
          data.meals.forEach(meal => {
            const mealCard = createMealCard(meal);
            searchResultsDiv.appendChild(mealCard);
          });
        } else {
          searchResultsDiv.innerHTML = '<p>No results found.</p>';
        }
      });
  }
}


// Function to create a meal card
function createMealCard(meal) {
  const mealCard = document.createElement('div');
  mealCard.classList.add('meal-card');
 // Create an image element for the meal image
 const mealImage = document.createElement('img');
 mealImage.src = meal.strMealThumb;
 mealImage.alt = meal.strMeal; //  This is important for accessibility, as it provides a description of the image in case it cannot be displayed.
 mealImage.classList.add('meal-image');
 mealCard.appendChild(mealImage);

  const mealName = document.createElement('h3');
  mealName.textContent = meal.strMeal;
  mealCard.appendChild(mealName);//We append the mealImage element as a child of the mealCard

  // Check if the meal is already in favoritesit returns boolean value
  const isFavorite = favoriteMeals.some(favMeal => favMeal.idMeal === meal.idMeal);

  if (isFavorite) {// if true 'Remuve'button will add
    const removeButton = document.createElement('button');
    removeButton.className="remove";
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeFromFavorites(meal));
    mealCard.appendChild(removeButton);
  } else {// if false 'Add to Favorites' button
    const addButton = document.createElement('button');
    addButton.className="add";
    addButton.textContent = 'Add to Favorites';
    addButton.addEventListener('click', () => addToFavorites(meal));
    mealCard.appendChild(addButton);
  }

  const mealLink = document.createElement('a');
  mealLink.href = `recipe.html?id=${meal.idMeal}`;//this is view details html link
  //The query parameter id is used to pass data to the destination page or API endpoint
  mealLink.textContent = 'View Details';
  mealCard.appendChild(mealLink);

  return mealCard;
}
// Get the search results from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
// It represents the current URL of the browser window
const searchResultsParam = urlParams.get('searchResults');

// Retrieve search results from localStorage if not available in URL
const searchResults = searchResultsParam ? JSON.parse(decodeURIComponent(searchResultsParam)) : JSON.parse(localStorage.getItem('searchResults'));

// Display search results on page load
window.addEventListener('load', () => {
  // the 'load' event, which fires when the page has finished loading.
  if (searchResults) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResults.forEach(meal => {
      const mealCard = createMealCard(meal);
     
      searchResultsContainer.appendChild(mealCard);
    });
  }
});

// Function to add a meal to favorites
function addToFavorites(meal) {
  //The condition favMeal.idMeal === meal.idMeal checks if the idMeal property of any meal in favoriteMeals matches the idMeal of the meal being added.
  if (!favoriteMeals.some(favMeal => favMeal.idMeal === meal.idMeal)) {
    favoriteMeals.push(meal);
    updateFavoritesPage();
  }
}

// Function to update favorites page
function updateFavoritesPage() {
  // Save favoriteMeals to localStorage for persistence
  localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
//The localStorage is an API provided by the browser, allowing us to store key-value pairs in the browser's storage.
}

// Event listener for search input
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (event) => {
  //The input event is triggered whenever the user interacts with the search input field (typing, pasting, or deleting text).
  const searchTerm = event.target.value;
  displaySearchResults(searchTerm);
});

// Load favorite meals from localStorage on page load
window.addEventListener('load', () => {
  const storedFavorites = localStorage.getItem('favoriteMeals');
  if (storedFavorites) {
    favoriteMeals = JSON.parse(storedFavorites);
    // convert JSON formate to array
    updateFavoritesPage();
  }
});
// Add event listener to the 'My Favorite' button
const myFavoriteButton = document.getElementById('viewFavoritesButton');
myFavoriteButton.addEventListener('click', showAllFavorites);

// Function to display all favorite meals
function showAllFavorites() {
  const favoritesContainer = document.getElementById('favoritesContainer');
 
  favoritesContainer.innerHTML = '';
  
  if (favoriteMeals.length > 0) {
    favoriteMeals.forEach(meal => {
      const mealCard = createMealCard(meal);
      
      favoritesContainer.appendChild(mealCard);
    });
  } else {
    favoritesContainer.innerHTML = '<p>No favorite meals added yet.</p>';
  }
}
//Remove meals from favorite list
function removeFromFavorites(meal) {
  // Find the index of the meal in the favoriteMeals array
  const index = favoriteMeals.findIndex(favMeal => favMeal.idMeal === meal.idMeal);

  if (index !== -1) {
    // Remove the meal from the favoriteMeals array
    favoriteMeals.splice(index, 1);

    // Update the favorites page
    updateFavoritesPage();

    // Save updated favoriteMeals to local storage for persistence
    localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
  }
}
