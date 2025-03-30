
import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CategoryRedirect = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Preserve any existing query parameters
    const searchParams = new URLSearchParams(location.search);
    const queryString = searchParams.toString();
    const redirectPath = `/search/category/${category}${queryString ? `?${queryString}` : ''}`;
    
    navigate(redirectPath, { replace: true });
  }, [category, navigate, location.search]);

  return null; // No UI needed for redirection
};

export default CategoryRedirect;
