interface FormDateInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

const FormDateInput: React.FC<FormDateInputProps> = ({
  title,
  value,
  onChange,
}) => {
  return (
    <>
      <h2>{title}:</h2>
      <div className="pt-2 pb-8">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder={title}
          aria-label={title}
        />
      </div>
    </>
  );
};

export default FormDateInput;
