import { useEffect, useState } from "react";

interface FormDateTimeInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  defaultTime?: string;
}

const FormDateTimeInput: React.FC<FormDateTimeInputProps> = ({
  title,
  value,
  onChange,
  defaultTime,
}) => {
  const [time, setTime] = useState<string>(
    defaultTime ? defaultTime : value.split("T")[1]
  );
  const [date, setDate] = useState<string>(value.split("T")[0]);
  const [dateHasBeenSet, setDateHasBeenSet] = useState(false);

  useEffect(() => {
    if (dateHasBeenSet && time === undefined) {
      const newTime = "23:59";
      setTime(newTime);
      onChange(`${date}T${newTime}`);
    }
  }, [dateHasBeenSet]);

  return (
    <>
      <h2>{title}:</h2>
      <div className="pt-2 pb-8 flex space-x-4">
        <input
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            onChange(`${e.target.value}T${time}`);
            setDateHasBeenSet(true);
          }}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder={`${title} Date`}
          aria-label={`${title} Date`}
        />
        <input
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            onChange(`${date}T${e.target.value}`);
          }}
          type="time"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder={`${title} Time`}
          aria-label={`${title} Time`}
        />
      </div>
    </>
  );
};

export default FormDateTimeInput;
