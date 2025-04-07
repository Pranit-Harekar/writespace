
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeTheme } from './lib/themeInitializer';

// Initialize theme before rendering the app
initializeTheme();

createRoot(document.getElementById('root')!).render(<App />);
