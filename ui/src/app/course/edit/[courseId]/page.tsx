"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import CoursesForm from "../../../../components/CoursesForm";
import Button from "@/components/Button";

const EditCourse: React.FC = () => {
  const { courses, fetchCourses, updateCourse } = useDashboard();
  const router = useRouter();
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [professor, setProfessor] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      await fetchCourses();
      const course = courses.find((c) => c.id === Number(courseId));
      if (course) {
        setTitle(course.name || "");
        setSection(course.section?.toString() || "");
        setSemester(course.term || "");
        setProfessor(course.professor || "");
      } else {
        router.push("/");
      }
      setLoading(false);
    };
  
    loadCourse();
  }, [courseId, fetchCourses, router]);

  const handleUpdateCourse = async () => {
    await updateCourse(Number(courseId), title, section, semester, professor);
    router.push("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Edit Course</h1>

      <CoursesForm
        title={title}
        setTitle={setTitle}
        section={section}
        setSection={setSection}
        semester={semester}
        setSemester={setSemester}
        professor={professor}
        setProfessor={setProfessor}
      />

      <div className="flex flex-row justify-end pt-4 space-x-2">
        <Button className="bg-gray-500 text-white px-4 py-2 rounded" href="/">
          Cancel
        </Button>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUpdateCourse}
          disabled={!title}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditCourse;
