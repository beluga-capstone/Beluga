"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import { useDashboard } from "@/hooks/useDashboard";
import CoursesForm from "../../../components/CoursesForm";
import { useRouter } from "next/navigation";

const NewCourse: React.FC = () => {
  const { addCourse } = useDashboard();
  const [name, setName] = useState("");
  const [section, setSection] = useState<number | "">("");
  const [professor, setProfessor] = useState("");
  const [term, setTerm] = useState("");
  const router = useRouter();

  const handleAddCourse = async () => {
    if (name && section && professor && term) {
      await addCourse(name, parseInt(section.toString()), professor, term);
      router.push("/");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Course</h1>

      <CoursesForm
        name={name}
        setName={setName}
        section={section}
        setSection={setSection}
        professor={professor}
        setProfessor={setProfessor}
        term={term}
        setTerm={setTerm}
      />

      <div className="flex flex-column justify-end">
        <div className="p-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href="/"
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleAddCourse}
            disabled={!name || !section || !professor || !term}
          >
            Add Course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;
