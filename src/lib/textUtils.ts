
import { cn } from "./utils";

/**
 * Strips HTML tags and converts HTML entities to their corresponding characters
 * @param html HTML string to clean
 * @param maxLength Optional maximum length for the returned string
 * @returns Plain text without HTML tags and with entities converted
 */
export function stripHtml(html: string, maxLength?: number): string {
  if (!html) return '';
  
  // Create a temporary DOM element
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  // Get the text content (this will remove all HTML tags and convert entities)
  let plainText = doc.body.textContent || '';
  
  // Trim and handle whitespace
  plainText = plainText.replace(/\s+/g, ' ').trim();
  
  // Truncate if needed
  if (maxLength && plainText.length > maxLength) {
    plainText = plainText.substring(0, maxLength) + '...';
  }
  
  return plainText;
}

/**
 * Extracts an excerpt from HTML content
 * @param content HTML content
 * @param maxLength Maximum length for the excerpt
 * @returns Plain text excerpt
 */
export const extractExcerpt = (content: string, maxLength: number = 160): string => {
  return stripHtml(content, maxLength);
};
