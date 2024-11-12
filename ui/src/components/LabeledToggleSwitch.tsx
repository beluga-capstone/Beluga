import ToggleSwitch from "./ToggleSwitch";

interface LabeledToggleSwitchProps {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const LabeledToggleSwitch: React.FC<LabeledToggleSwitchProps> = ({
  title,
  value,
  onChange,
}) => {
  return (
    <>
      <div className="flex items-center pb-6">
        <ToggleSwitch value={value} onChange={onChange} />
        <h2 className="px-4">{title}</h2>
      </div>
    </>
  );
};

export default LabeledToggleSwitch;
