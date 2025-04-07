import { useTheme } from '@/components/ThemeProvider';

export function usePlaceholderImage() {
  const { theme } = useTheme();
  return theme === 'dark' ? '/placeholder-dark.svg' : '/placeholder.svg';
}
