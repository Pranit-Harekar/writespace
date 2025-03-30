import { useLocation } from 'react-router-dom';
import { Footer } from './Footer';

export const ConditionalFooter = () => {
  const location = useLocation();

  const paths = ['/', '/about', '/help', '/privacy', '/terms'];

  const showFooter = paths.some(path => location.pathname === path);

  return showFooter ? <Footer /> : null;
};
