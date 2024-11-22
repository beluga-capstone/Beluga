import React from "react";

interface CoursesFormProps {
  name: string;
  setName: (value: string) => void;
  term: string;
  setTerm: (value: string) => void;
  professor: string;
  setProfessor: (value: string) => void;
  professors: { id: string; name: string }[]; // Add professors array
}

const CoursesForm: React.FC<CoursesFormProps> = ({
  name,
  setName,
  term,
  setTerm,
  professor,
  setProfessor,
  professors,
}) => {
  return (
    <>
      <div className="flex space-x-8 mb-8">
        <div className="flex flex-col w-1/3">
          <label className="font-semibold mb-1">Course Name</label>
          <input
            type="text"
            value={name}
            className="border rounded p-2 bg-surface"
            onChange={(e) => setName(e.target.value)}
            placeholder="Course name"
            aria-label="Course name"
          />
        </div>
        <div className="flex flex-col w-1/3">
          <label className="font-semibold mb-1">Term</label>
          <input
            type="text"
            value={term}
            className="border rounded p-2 bg-surface"
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Term"
            aria-label="Term"
          />
        </div>
        <div className="flex flex-col w-1/3">
          <label className="font-semibold mb-1">Professor</label>
          <input
            type="text"
            value={professor}
            className="border rounded p-2 bg-surface"
            onChange={(e) => setProfessor(e.target.value)}
            placeholder="Professor"
            aria-label="Professor"
          />
        </div>
      </div>
    </>
  );
};

export default CoursesForm;
