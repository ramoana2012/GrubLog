// Main application initialization
document.getElementById('loading-spinner')?.classList.add('hidden');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add Bootstrap icons stylesheet
  const iconStylesheet = document.createElement('link');
  iconStylesheet.rel = 'stylesheet';
  iconStylesheet.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
  document.head.appendChild(iconStylesheet);
  
  // Check if Firebase is properly initialized
  if (firebase.apps.length) {
    // Ensure loading is hidden after Firebase init
    hideLoading();
  } else {
    showError('Firebase initialization failed. Please check your configuration.');
  }
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Global error handler - streamlined to reduce console clutter
window.addEventListener('error', (event) => {
  // Show user-friendly error message
  showError(`An error occurred: ${event.error?.message || 'Unknown error'}`);
  
  // Always ensure loading spinner is hidden
  hideLoading();
});
