import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure dark mode is applied before rendering
const applyDarkMode = () => {
  const darkModePreference = localStorage.getItem('darkMode') === 'true';
  if (darkModePreference || darkModePreference === null) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Apply dark mode immediately
applyDarkMode();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
