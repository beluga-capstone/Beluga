import { useState } from "react";
import { DEFAULT_COURSES } from "@/constants";


interface Course {
  id: number;
  name: string;
  section: number;
  term: string;
  studentsEnrolled: number;
  isPublished: boolean;
}

export const useDashboard = () => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);

  const setPublished = (id: number, status: boolean) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id ? { ...course, isPublished: status } : course
      )
    );
  };

  return {
    courses,
    setPublished,
  };
};
