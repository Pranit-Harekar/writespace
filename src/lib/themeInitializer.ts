
import { STORAGE_KEYS, getStorageItem } from './storage';

/**
 * Initialize theme based on localStorage or system preference
 * This should be imported in the main.tsx file
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  // Check if theme preference exists in localStorage
  const savedTheme = getStorageItem<string | null>(STORAGE_KEYS.THEME, null);
  
  // If there's no saved theme in our app storage, check the shadcn theme storage
  const shadcnTheme = localStorage.getItem('vite-ui-theme');
  
  if (savedTheme) {
    // Apply saved theme from our app storage
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else if (shadcnTheme) {
    // Apply theme from shadcn storage if available
    if (shadcnTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (shadcnTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (shadcnTheme === 'system') {
      // Apply system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } else {
    // Check system preference if no stored preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
}
