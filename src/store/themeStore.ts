import { create } from 'zustand';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Helper function to check system preference
const getSystemPreference = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default to dark if window is not available
};

// Helper function to apply theme to document
const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const isDark = theme === 'dark' || (theme === 'system' && getSystemPreference() === 'dark');
  
  // Remove both classes first
  root.classList.remove('light', 'dark');
  
  // Add the appropriate class
  root.classList.add(isDark ? 'dark' : 'light');
  
  // Set color-scheme
  root.style.colorScheme = isDark ? 'dark' : 'light';
  
  // Force background color to ensure it's applied
  if (isDark) {
    document.body.style.backgroundColor = 'var(--background)';
    document.body.style.color = 'var(--foreground)';
  } else {
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
  }
  
  // Store the theme preference
  localStorage.setItem('theme', theme);
  localStorage.setItem('darkMode', String(isDark));
};

// Function to ensure dark mode is applied
const ensureDarkMode = () => {
  const storedTheme = localStorage.getItem('theme') as Theme || 'dark';
  const isDark = storedTheme === 'dark' || 
    (storedTheme === 'system' && getSystemPreference() === 'dark');
  
  if (isDark && !document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = 'var(--background)';
    document.body.style.color = 'var(--foreground)';
  }
};

export const useThemeStore = create<ThemeState>((set) => {
  // Get stored theme or default to dark
  const storedTheme = typeof localStorage !== 'undefined' ? 
    (localStorage.getItem('theme') as Theme || 'dark') : 'dark';
  
  // Initialize theme
  const systemPreference = getSystemPreference();
  const isDarkMode = storedTheme === 'dark' || 
    (storedTheme === 'system' && systemPreference === 'dark');
  
  // Apply theme on initialization
  if (typeof window !== 'undefined') {
    applyTheme(storedTheme);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = localStorage.getItem('theme') as Theme || 'dark';
      if (currentTheme === 'system') {
        applyTheme('system');
        set({ isDarkMode: mediaQuery.matches });
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Set up an observer to ensure dark mode is applied after DOM changes
    const observer = new MutationObserver(() => {
      ensureDarkMode();
    });
    
    // Start observing the document
    observer.observe(document.documentElement, { 
      attributes: true, 
      childList: true, 
      subtree: true 
    });
    
    // Check dark mode periodically
    setInterval(ensureDarkMode, 1000);
  }
  
  return {
    theme: storedTheme,
    isDarkMode,
    
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.isDarkMode ? 'light' : 'dark';
        applyTheme(newTheme);
        return { 
          theme: newTheme,
          isDarkMode: !state.isDarkMode 
        };
      });
    },
    
    setTheme: (theme: Theme) => {
      applyTheme(theme);
      const isDark = theme === 'dark' || 
        (theme === 'system' && getSystemPreference() === 'dark');
      
      set({ 
        theme,
        isDarkMode: isDark
      });
    }
  };
}); 