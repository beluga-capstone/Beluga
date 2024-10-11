import React from 'react';

interface ButtonProps {
  onClick: (...args:any[]) => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, className, children }) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

export default Button;
