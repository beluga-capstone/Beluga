import React from "react";
import { User } from "@/types";

interface CoursesFormProps {
  title: string;
  setTitle: (value: string) => void;
  section: string;
  setSection: (value: string) => void;
  professor: string;
  setProfessor: (value: string) => void;
  semester: string;
  setSemester: (value: string) => void;
  professors: User[]; // Added professors prop
}

const CoursesForm: React.FC<CoursesFormProps> = ({
  title,
  setTitle,
  section,
  setSection,
  professor,
  setProfessor,
  semester,
  setSemester,
  professors,
}) => {
  return (
    <>
      <div className="flex space-x-8 mb-8">
        <div className="flex flex-col w-1/5">
          <label className="font-semibold mb-1">Course Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="border rounded p-2 bg-surface"
            placeholder="Course name"
            aria-label="Course name"
          />
        </div>

        <div className="flex flex-col w-1/7">
          <label className="font-semibold mb-1">Section</label>
          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            type="text"
            className="border rounded p-2 bg-surface"
            placeholder="Section"
            aria-label="Section"
          />
        </div>

        <div className="flex flex-col w-1/5">
          <label className="font-semibold mb-1">Semester</label>
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            type="text"
            className="border rounded p-2 bg-surface"
            placeholder="Semester"
            aria-label="Semester"
          />
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <label className="font-semibold mb-1">Professor</label>
        <select
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          className="border rounded p-2 bg-surface"
        >
          <option value="">Select a Professor</option>
          {professors.map((prof) => (
            <option key={prof.user_id} value={prof.user_id}>
              {prof.first_name} {prof.last_name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CoursesForm;
