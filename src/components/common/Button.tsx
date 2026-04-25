import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary-gold' | 'secondary' | 'action' | 'icon' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary-gold', size = 'md', children, className = '', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary-gold': return 'btn-primary-gold';
      case 'secondary': return 'btn-secondary';
      case 'action': return 'btn-action';
      case 'icon': return 'btn-icon';
      case 'danger': return 'btn-danger';
      default: return '';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      default: return '';
    }
  };

  return (
    <button className={`${getVariantClass()} ${getSizeClass()} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
