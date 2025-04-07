
import { STORAGE_KEYS, getStorageItem } from './storage';

/**
 * Initialize theme based on localStorage or system preference
 * This should be imported in the main.tsx file
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  // Check if theme preference exists in localStorage
  const savedTheme = getStorageItem<string | null>(STORAGE_KEYS.THEME, null);
  
  if (savedTheme) {
    // Apply saved theme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
}
