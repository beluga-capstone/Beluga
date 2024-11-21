interface FormSelectProps {
    title: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
  }
  
  const FormSelect: React.FC<FormSelectProps> = ({
    title,
    value,
    onChange,
    options,
    placeholder = "Select an option",
  }) => {
    return (
      <>
        <h2>{title}</h2>
        <div className="pt-2 pb-8">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded p-1 bg-surface"
            aria-label={title}
          >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  };
  
  export default FormSelect;
  