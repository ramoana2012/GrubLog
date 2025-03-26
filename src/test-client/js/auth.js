// Authentication module for GrubLog test client
// Auth state variables
let currentUser = null;

// DOM Elements
const authStatusElement = document.getElementById('auth-status');
const loginFormElement = document.getElementById('login-form');
const logoutSectionElement = document.getElementById('logout-section');
const userEmailElement = document.getElementById('user-email');
const loginButtonElement = document.getElementById('login-button');
const registerButtonElement = document.getElementById('register-button');
const googleLoginButtonElement = document.getElementById('google-login-button');
const logoutButtonElement = document.getElementById('logout-button');
const mealFormSectionElement = document.getElementById('meal-form-section');
const mealsListSectionElement = document.getElementById('meals-list-section');

// Wait for Firebase to be initialized before setting up auth
document.addEventListener('firebaseReady', () => {
  // Initialize auth state
  firebase.auth().onAuthStateChanged((user) => {
    hideLoading(); // Hide loading when auth state changes
    if (user) {
      // User is signed in
      currentUser = user;
      updateAuthUI(true);
      loadMeals(); // Load meals when user is authenticated
    } else {
      // User is signed out
      currentUser = null;
      updateAuthUI(false);
    }
  });

  // Set up event listeners
  setupEventListeners();
});

// Update the UI based on authentication state
function updateAuthUI(isAuthenticated) {
  if (isAuthenticated && currentUser) {
    // Update auth status
    authStatusElement.className = 'alert alert-success';
    authStatusElement.textContent = 'Authenticated successfully!';
    
    // Show user info
    userEmailElement.textContent = currentUser.email;
    loginFormElement.classList.add('hidden');
    logoutSectionElement.classList.remove('hidden');
    
    // Show meal sections
    mealFormSectionElement.classList.remove('hidden');
    mealsListSectionElement.classList.remove('hidden');
  } else {
    // Update auth status
    authStatusElement.className = 'alert alert-info';
    authStatusElement.textContent = 'Not authenticated. Please sign in.';
    
    // Hide user info
    loginFormElement.classList.remove('hidden');
    logoutSectionElement.classList.add('hidden');
    
    // Hide meal sections
    mealFormSectionElement.classList.add('hidden');
    mealsListSectionElement.classList.add('hidden');
  }
}

// Email/Password Sign In
async function signInWithEmailPassword(email, password) {
  try {
    showLoading();
    await firebase.auth().signInWithEmailAndPassword(email, password);
    showSuccess('Signed in successfully!');
  } catch (error) {
    showError(error.message);
    hideLoading(); // Ensure loading is hidden on error
  } finally {
    hideLoading();
  }
}

// Email/Password Registration
async function registerWithEmailPassword(email, password) {
  try {
    showLoading();
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    showSuccess('Account created successfully!');
  } catch (error) {
    showError(error.message);
    hideLoading(); // Ensure loading is hidden on error
  } finally {
    hideLoading();
  }
}

// Google Sign In
async function signInWithGoogle() {
  try {
    showLoading();
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    showSuccess('Signed in with Google successfully!');
  } catch (error) {
    showError(error.message);
    hideLoading(); // Ensure loading is hidden on error
  } finally {
    hideLoading();
  }
}

// Sign Out
async function signOut() {
  try {
    showLoading();
    await firebase.auth().signOut();
    showSuccess('Signed out successfully!');
  } catch (error) {
    showError(error.message);
    hideLoading(); // Ensure loading is hidden on error
  } finally {
    hideLoading();
  }
}

// Set up event listeners
function setupEventListeners() {
  loginButtonElement.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showError('Email and password are required');
      return;
    }
    
    signInWithEmailPassword(email, password);
  });

  registerButtonElement.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showError('Email and password are required');
      return;
    }
    
    if (password.length < 6) {
      showError('Password should be at least 6 characters');
      return;
    }
    
    registerWithEmailPassword(email, password);
  });

  googleLoginButtonElement.addEventListener('click', signInWithGoogle);
  logoutButtonElement.addEventListener('click', signOut);

  // Test API connection
  document.getElementById('debug-button').addEventListener('click', async () => {
    try {
      showLoading();
      const user = firebase.auth().currentUser;
      
      if (!user) {
        showError('You must be logged in to test the API connection');
        hideLoading();
        return;
      }
      
      // Test Firestore connection
      const mealsCollection = firebase.firestore().collection('meals');
      const query = mealsCollection.where('userId', '==', user.uid).limit(1);
      const snapshot = await query.get();
      
      hideLoading();
      showSuccess(`API connection successful! Found ${snapshot.size} meals.`);
    } catch (error) {
      hideLoading();
      showError(`API connection error: ${error.message}`);
    }
  });
}
