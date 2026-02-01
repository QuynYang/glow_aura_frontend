import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'white';
}

export const Button = ({ variant = 'primary', className = '', children, ...props }: ButtonProps) => {
  const baseStyle = "px-8 py-3 transition-all duration-300 font-medium tracking-wide text-sm uppercase";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    white: "border border-white text-white hover:bg-white hover:text-primary",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};