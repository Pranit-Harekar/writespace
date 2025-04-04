
import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileLinkProps {
  username: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileLink: React.FC<ProfileLinkProps> = ({ 
  username, 
  children, 
  className = '' 
}) => {
  if (!username) return <>{children}</>;
  
  return (
    <Link 
      to={`/profile/${username}`} 
      className={`hover:underline ${className}`}
    >
      {children}
    </Link>
  );
};
