import Link from "next/link";
import React from "react";

interface ButtonProps {
  onClick?: (event: React.MouseEvent) => void;
  href?: string;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  href,
  disabled,
  className,
  children,
}) =>
  href ? (
    <Link href={href}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${className} ${
          disabled ? "text-opacity-50 bg-opacity-50" : ""
        }`}
      >
        {children}
      </button>
    </Link>
  ) : (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${
        disabled ? "text-opacity-50 bg-opacity-50" : ""
      }`}
    >
      {children}
    </button>
  );

export default Button;
