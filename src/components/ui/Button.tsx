import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Thêm 'solid-white' vào danh sách variant
  variant?: 'primary' | 'outline' | 'white' | 'solid-white'; 
}

export const Button = ({ variant = 'primary', className = '', children, ...props }: ButtonProps) => {
  const baseStyle = "px-8 py-3 transition-all duration-300 font-medium tracking-wide text-sm uppercase flex items-center justify-center";
  
  const variants = {
    // 1. Nút chính (Nền đỏ rượu, chữ trắng)
    primary: "bg-primary text-white hover:bg-primary-hover border border-transparent",
    
    // 2. Nút viền (Viền đỏ, chữ đỏ)
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    
    // 3. Nút trong suốt viền trắng (Dùng trên nền đen/ảnh tối)
    white: "border border-white text-white hover:bg-white hover:text-primary",
    
    // 4. MỚI! Nút nền trắng đặc (Dùng cho Add To Cart, chữ sẽ màu đỏ rượu)
    'solid-white': "bg-white text-primary border border-transparent hover:bg-primary hover:text-white shadow-md",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};