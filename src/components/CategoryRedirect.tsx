import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CategoryRedirect = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/search/category/${category}`, { replace: true });
  }, [category, navigate]);

  return null; // No UI needed for redirection
};

export default CategoryRedirect;
