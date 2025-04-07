
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from './Footer';

export const ConditionalFooter = () => {
  const location = useLocation();
  
  // Only show footer on the home page (root path)
  const showFooter = location.pathname === '/';
  
  return showFooter ? <Footer /> : null;
};
