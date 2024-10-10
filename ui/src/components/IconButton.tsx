interface IconButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, title, disabled, className, children }) => (
  <button onClick={onClick} title={title} disabled={disabled} className={`${className} ${disabled ? "" : "hover:bg-hover-on-surface"}`}>
    {children}
  </button>
);

export default IconButton;
