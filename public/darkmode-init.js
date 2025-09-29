// This script runs before React loads to ensure dark mode is applied immediately
(function() {
  // Check for dark mode preference in localStorage
  const darkModePreference = localStorage.getItem('darkMode') === 'true';
  
  // Apply dark mode class to html element
  if (darkModePreference || darkModePreference === null) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Set body classes for dark mode
  if (darkModePreference || darkModePreference === null) {
    document.body.classList.add('dark:bg-dark-200', 'dark:text-gray-100');
  }
})(); 