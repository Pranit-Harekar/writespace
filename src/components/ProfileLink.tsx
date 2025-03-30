import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileLinkProps {
  username: string;
  children?: React.ReactNode;
  className?: string;
  userId?: string;
  displayName?: string;
  onClick?: () => void;
}

export const ProfileLink: React.FC<ProfileLinkProps> = ({
  username,
  children,
  className = '',
  userId,
  displayName,
  onClick,
}) => {
  if (!username) return <>{children}</>;

  return (
    <Link to={`/profile/${username}`} className={`hover:underline ${className}`} onClick={onClick}>
      {children || displayName}
    </Link>
  );
};
