import React from 'react';

interface AvatarProps {
  initials: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ initials, color = '#EEE', size = 'md', className = '' }) => {
  return (
    <div 
      className={`avatar avatar-${size} ${className}`} 
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
