import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary'
}) => {
  const baseClasses = "p-2 rounded-full transition-colors duration-200 focus:outline-none";
  
  const variantClasses = {
    primary: "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
    secondary: "hover:bg-gray-200 text-gray-500 hover:text-gray-700",
    danger: "hover:bg-red-100 text-red-500 hover:text-red-700"
  };

  const buttonContent = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon}
    </button>
  );

  return buttonContent;
};

export default IconButton;
