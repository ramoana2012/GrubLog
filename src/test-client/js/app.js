// Main application initialization
document.getElementById('loading-spinner')?.classList.add('hidden');

// Show loading indicator while Firebase initializes
showLoading();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add Bootstrap icons stylesheet
  const iconStylesheet = document.createElement('link');
  iconStylesheet.rel = 'stylesheet';
  iconStylesheet.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
  document.head.appendChild(iconStylesheet);
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Listen for Firebase initialization completion
document.addEventListener('firebaseReady', () => {
  // Check if Firebase is properly initialized
  if (firebase.apps.length) {
    console.log('Firebase is ready to use');
    hideLoading();
  } else {
    showError('Firebase initialization failed. Please check your configuration.');
  }
});

// Global error handler - streamlined to reduce console clutter
window.addEventListener('error', (event) => {
  // Show user-friendly error message
  showError(`An error occurred: ${event.error?.message || 'Unknown error'}`);
  
  // Always ensure loading spinner is hidden
  hideLoading();
});
