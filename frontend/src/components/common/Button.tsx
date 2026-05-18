import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'social';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none py-2 px-4';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover border border-transparent',
    secondary: 'bg-accent text-primary hover:bg-pink-100 border border-transparent',
    outline: 'bg-transparent border border-border-color text-text-body hover:bg-gray-50',
    social: 'bg-accent text-text-body border border-transparent hover:bg-gray-100',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <button className={classes} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
