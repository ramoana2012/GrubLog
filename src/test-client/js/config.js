// Firebase configuration and UI utilities
// Load configuration from window.ENV or use a fetch request to get config from server
const getFirebaseConfig = async () => {
  try {
    // Determine the base URL based on the current environment
    const baseUrl = window.location.protocol === 'file:' 
      ? 'http://localhost:4000' // When opened directly from file system
      : window.location.origin; // When served through Express (use absolute path)
    
    // Try to fetch configuration from the server
    const response = await fetch(`${baseUrl}/api/config`);
    if (response.ok) {
      const config = await response.json();
      return config.firebase;
    } else {
      throw new Error('Failed to fetch configuration');
    }
  } catch (error) {
    console.error('Error loading config from server:', error);
    throw error;
  }
};

// Initialize Firebase asynchronously
(async () => {
  try {
    const firebaseConfig = await getFirebaseConfig();
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    
    // Dispatch an event to notify other scripts that Firebase is ready
    document.dispatchEvent(new CustomEvent('firebaseReady'));
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    showError('Failed to initialize Firebase. Please try again later.');
  }
})();

// Loading indicator functions
function showLoading() {
  document.getElementById('loading-spinner').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-spinner').classList.add('hidden');
}

// Make sure loading is hidden initially
document.addEventListener('DOMContentLoaded', () => {
  hideLoading();
});

// Error display function
function showError(message) {
  const errorAlert = document.createElement('div');
  errorAlert.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  errorAlert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.appendChild(errorAlert);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    errorAlert.remove();
  }, 5000);
}

// Success message function
function showSuccess(message) {
  const successAlert = document.createElement('div');
  successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  successAlert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.appendChild(successAlert);
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    successAlert.remove();
  }, 3000);
}
