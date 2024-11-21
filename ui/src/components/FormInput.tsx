interface FormInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({ title, value, onChange, type = "text" }) => {
  return (
    <>
      <h2>{title}</h2>
      <div className="pt-2 pb-8">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          className="border rounded p-1 bg-surface"
          placeholder={title}
          aria-label={title}
        />
      </div>
    </>
  );
};

export default FormInput;
