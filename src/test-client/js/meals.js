// Meals management module for GrubLog test client
// Meals state
let meals = [];
let currentEditingMealId = null;

// DOM Elements
const mealsListElement = document.getElementById('meals-list');
const noMealsMessageElement = document.getElementById('no-meals-message');
const addMealButtonElement = document.getElementById('add-meal-button');
const mealFormElement = document.getElementById('meal-form');
const mealFormTitleElement = document.getElementById('meal-form-title');
const mealIdInput = document.getElementById('meal-id');
const mealNameInput = document.getElementById('meal-name');
const mealDateInput = document.getElementById('meal-date');
const mealDifficultyInput = document.getElementById('meal-difficulty');
const mealNutritionInput = document.getElementById('meal-nutrition');
const mealCuisineInput = document.getElementById('meal-cuisine');
const mealRatingInput = document.getElementById('meal-rating');
const mealNotesInput = document.getElementById('meal-notes');
const saveMealButtonElement = document.getElementById('save-meal-button');
const cancelEditButtonElement = document.getElementById('cancel-edit-button');

// Load meals directly from Firestore
async function loadMeals() {
  try {
    showLoading();
    
    // Get the current user
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }
    
    // Reference to the meals collection
    const mealsCollection = firebase.firestore().collection('meals');
    
    // Query meals for the current user, ordered by date
    const query = mealsCollection
      .where('userId', '==', user.uid)
      .orderBy('date', 'desc');
    
    // Execute the query
    const snapshot = await query.get();
    
    // Convert the snapshot to an array of meals
    meals = [];
    snapshot.forEach(doc => {
      meals.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Render the meals
    renderMeals();
  } catch (error) {
    // Show user-friendly error message
    if (error.message.includes('permission-denied')) {
      showError('Permission denied. Please check your Firestore security rules.');
    } else if (error.message.includes('requires an index')) {
      showError('Database index required. Please check the console for more information.');
    } else {
      showError(`Failed to load meals: ${error.message}`);
    }
  } finally {
    hideLoading();
  }
}

// Render meals list
function renderMeals() {
  if (meals.length === 0) {
    mealsListElement.innerHTML = '';
    noMealsMessageElement.classList.remove('hidden');
    return;
  }
  
  noMealsMessageElement.classList.add('hidden');
  
  // Sort meals by date (newest first)
  const sortedMeals = [...meals].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  mealsListElement.innerHTML = sortedMeals.map(meal => createMealCard(meal)).join('');
  
  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.edit-meal-button').forEach(button => {
    button.addEventListener('click', () => editMeal(button.dataset.mealId));
  });
  
  document.querySelectorAll('.delete-meal-button').forEach(button => {
    button.addEventListener('click', () => deleteMeal(button.dataset.mealId));
  });
}

// Create HTML for a meal card
function createMealCard(meal) {
  // Format date for display
  const dateObj = new Date(meal.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Create rating stars
  const fullStars = Math.floor(meal.rating);
  const hasHalfStar = meal.rating % 1 !== 0;
  let starsHtml = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="bi bi-star-fill"></i> ';
  }
  
  if (hasHalfStar) {
    starsHtml += '<i class="bi bi-star-half"></i> ';
  }
  
  const emptyStars = 5 - Math.ceil(meal.rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="bi bi-star"></i> ';
  }
  
  // Determine difficulty and nutrition classes
  const difficultyClass = `difficulty-${meal.difficulty}`;
  const nutritionClass = `nutrition-${meal.nutrition}`;
  
  return `
    <div class="col-md-6 col-lg-4 meal-card">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${meal.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${formattedDate}</h6>
          
          <p class="card-text">
            <span class="badge bg-secondary">${meal.cuisine}</span>
            <span class="badge ${meal.difficulty === 'easy' ? 'bg-success' : meal.difficulty === 'medium' ? 'bg-warning' : 'bg-danger'}">${meal.difficulty}</span>
            <span class="badge ${meal.nutrition === 'healthy' ? 'bg-success' : 'bg-danger'}">${meal.nutrition}</span>
          </p>
          
          <p class="card-text rating-stars">
            ${starsHtml} <span class="text-muted">(${meal.rating})</span>
          </p>
          
          ${meal.notes ? `<p class="card-text">${meal.notes}</p>` : ''}
          
          <div class="d-flex justify-content-end mt-3">
            <button class="btn btn-sm btn-outline-primary me-2 edit-meal-button" data-meal-id="${meal.id}">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-meal-button" data-meal-id="${meal.id}">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Add new meal
function addNewMeal() {
  // Reset form
  resetMealForm();
  
  // Set default date to today
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  mealDateInput.value = formattedDate;
  
  // Update form title
  mealFormTitleElement.textContent = 'Add New Meal';
  
  // Scroll to form
  mealFormElement.scrollIntoView({ behavior: 'smooth' });
}

// Edit meal
function editMeal(mealId) {
  const meal = meals.find(m => m.id === mealId);
  if (!meal) return;
  
  // Set form values
  mealIdInput.value = meal.id;
  mealNameInput.value = meal.name;
  mealDateInput.value = meal.date.split('T')[0]; // Format date for input
  mealDifficultyInput.value = meal.difficulty;
  mealNutritionInput.value = meal.nutrition;
  mealCuisineInput.value = meal.cuisine;
  mealRatingInput.value = meal.rating;
  mealNotesInput.value = meal.notes || '';
  
  // Update form title and current editing ID
  mealFormTitleElement.textContent = 'Edit Meal';
  currentEditingMealId = mealId;
  
  // Scroll to form
  mealFormElement.scrollIntoView({ behavior: 'smooth' });
}

// Delete meal
async function deleteMeal(mealId) {
  if (!confirm('Are you sure you want to delete this meal?')) {
    return;
  }
  
  try {
    showLoading();
    
    // Reference to the meal document
    const mealRef = firebase.firestore().collection('meals').doc(mealId);
    
    // Delete the meal
    await mealRef.delete();
    
    // Remove from meals array
    meals = meals.filter(meal => meal.id !== mealId);
    
    // Render meals
    renderMeals();
    
    showSuccess('Meal deleted successfully!');
  } catch (error) {
    showError(`Failed to delete meal: ${error.message}`);
  } finally {
    hideLoading();
  }
}

// Reset meal form
function resetMealForm() {
  mealFormElement.reset();
  mealIdInput.value = '';
  currentEditingMealId = null;
}

// Save meal (create or update)
async function saveMeal(event) {
  event.preventDefault();
  
  // Validate form
  if (!mealFormElement.checkValidity()) {
    mealFormElement.reportValidity();
    return;
  }
  
  // Get current user
  const user = firebase.auth().currentUser;
  if (!user) {
    showError('You must be logged in to save a meal');
    return;
  }
  
  try {
    showLoading();
    
    // Reference to the meals collection
    const mealsCollection = firebase.firestore().collection('meals');
    
    // Prepare meal data
    const now = new Date().toISOString();
    const mealData = {
      name: mealNameInput.value,
      date: new Date(mealDateInput.value).toISOString(),
      difficulty: mealDifficultyInput.value,
      nutrition: mealNutritionInput.value,
      cuisine: mealCuisineInput.value,
      rating: parseFloat(mealRatingInput.value),
      notes: mealNotesInput.value,
      userId: user.uid,
      updatedAt: now
    };
    
    if (currentEditingMealId) {
      // Update existing meal
      const mealRef = mealsCollection.doc(currentEditingMealId);
      await mealRef.update(mealData);
      
      // Update meals array
      const index = meals.findIndex(meal => meal.id === currentEditingMealId);
      if (index !== -1) {
        meals[index] = {
          id: currentEditingMealId,
          ...mealData
        };
      }
      
      showSuccess('Meal updated successfully!');
    } else {
      // Add createdAt for new meals
      mealData.createdAt = now;
      
      // Create new meal
      const docRef = await mealsCollection.add(mealData);
      
      // Add to meals array
      meals.push({
        id: docRef.id,
        ...mealData
      });
      
      showSuccess('Meal added successfully!');
    }
    
    // Reset form and render meals
    resetMealForm();
    renderMeals();
  } catch (error) {
    showError(`Failed to save meal: ${error.message}`);
  } finally {
    hideLoading();
  }
}

// Event Listeners
addMealButtonElement.addEventListener('click', addNewMeal);
mealFormElement.addEventListener('submit', saveMeal);
cancelEditButtonElement.addEventListener('click', () => {
  resetMealForm();
  mealFormTitleElement.textContent = 'Add New Meal';
});
