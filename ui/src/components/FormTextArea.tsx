interface FormTextAreaProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  title,
  value,
  onChange,
}) => {
  return (
    <>
      <h2>{title}</h2>
      <div className="pt-2 pb-8">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded p-1 bg-surface w-3/4"
          placeholder={title}
          aria-label={title}
          rows={5}
        />
      </div>
    </>
  );
};

export default FormTextArea;
