import { useState, useEffect } from "react";

interface Course {
  id: number;
  name: string;
  section: string;
  term: string;
  studentsEnrolled: number;
  isPublished: boolean;
}

const loadCoursesFromStorage = (): Course[] => {
  const data = localStorage.getItem("courses");
  return data ? JSON.parse(data) : [];
};

const saveCoursesToStorage = (courses: Course[]) => {
  localStorage.setItem("courses", JSON.stringify(courses));
};

export const useDashboard = () => {
  const [courses, setCourses] = useState<Course[]>(loadCoursesFromStorage());

  useEffect(() => {
    saveCoursesToStorage(courses);
  }, [courses]);

  const addCourse = (name: string, section: string, term: string, studentsEnrolled: number) => {
    const newCourse: Course = {
      id: Date.now(),
      name,
      section,
      term,
      studentsEnrolled,
      isPublished: false,
    };
    setCourses([...courses, newCourse]);
  };

  const setPublished = (id: number, status: boolean) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === id ? { ...course, isPublished: status } : course))
    );
  };

  return {
    courses,
    setPublished,
    addCourse,
  };
};
