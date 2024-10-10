import React from "react";
import { LucideProps } from "lucide-react";

interface IconButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  iconColor: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  title,
  onClick,
  disabled,
  className,
  icon,
  iconColor,
}) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-1 rounded ${disabled ? "" : "hover:bg-hover-on-surface"} ${className}`}
  >
    {React.createElement(icon, {
      className: `text-${iconColor} ${disabled ? "text-opacity-50" : ""}`,
    })}
  </button>
);

export default IconButton;
