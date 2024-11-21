import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

interface CoursesFormProps {
  name: string;
  setName: (value: string) => void;
  section: number | "";
  setSection: (value: number | "") => void;
  professor: string;
  setProfessor: (value: string) => void;
  term: string;
  setTerm: (value: string) => void;
}

const CoursesForm: React.FC<CoursesFormProps> = ({
  name,
  setName,
  section,
  setSection,
  professor,
  setProfessor,
  term,
  setTerm,
}) => {
  return (
    <>
      <FormInput
        title="Course Name"
        value={name}
        onChange={setName}
      />

      <FormInput
        title="Section"
        value={section === "" ? "" : section.toString()}
        onChange={(value) =>
          setSection(value === "" ? "" : Number(value))
        }
        type="number"
        placeholder="Enter the section number"
      />

      <FormInput
        title="Professor Name"
        value={professor}
        onChange={setProfessor}
      />

      <FormSelect
        title="Term"
        value={term}
        onChange={setTerm}
        options={["Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"]}
        placeholder="Select a term"
      />
    </>
  );
};

export default CoursesForm;
