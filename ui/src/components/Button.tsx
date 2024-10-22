import Link from "next/link";
import React from "react";

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, href, disabled, className, children }) => (
  href ? (
    <Link href={href}>
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
    </Link>
  ) : (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  )
);

export default Button;
