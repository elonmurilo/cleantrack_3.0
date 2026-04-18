import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary-gold' | 'action' | 'icon';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary-gold', children, className = '', ...props }) => {
  const getClassName = () => {
    switch (variant) {
      case 'primary-gold': return 'btn-primary-gold';
      case 'action': return 'btn-action';
      case 'icon': return 'btn-icon';
      default: return '';
    }
  };

  return (
    <button className={`${getClassName()} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
