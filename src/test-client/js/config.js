// Firebase configuration and UI utilities
// In a real app, these would be loaded from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyD35irGm_EI20dVMeWlR7mxjT2O3xisXxo",
  authDomain: "grublog-4863a.firebaseapp.com",
  projectId: "grublog-4863a",
  storageBucket: "grublog-4863a.firebasestorage.app",
  messagingSenderId: "473006181517",
  appId: "1:473006181517:web:68f9bd285d474fccdd26c4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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
