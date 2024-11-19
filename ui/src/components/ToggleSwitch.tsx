import { ToggleLeft, ToggleRight } from "lucide-react";

interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange }) => {
  return value ? (
    <ToggleRight
      size={32}
      className="text-green-500"
      onClick={() => onChange(false)}
    />
  ) : (
    <ToggleLeft
      size={32}
      className="text-red-500"
      onClick={() => onChange(true)}
    />
  );
};

export default ToggleSwitch;
