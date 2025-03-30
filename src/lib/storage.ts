
/**
 * Utility functions to work with localStorage
 */

const STORAGE_KEYS = {
  VIEW_MODE: 'writespace-view-mode',
  THEME: 'writespace-theme',
} as const;

/**
 * Get a value from localStorage
 * @param key The key to retrieve
 * @param defaultValue Default value if key doesn't exist
 * @returns The stored value or default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Save a value to localStorage
 * @param key The key to save under
 * @param value The value to save
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export { STORAGE_KEYS };
