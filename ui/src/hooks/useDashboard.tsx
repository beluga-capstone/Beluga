import { useState, useEffect } from "react";

interface Course {
  id: number;
  name: string;
  section: string;
  professor: string;
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

  const addCourse = (name: string, section: string, professor: string, term: string, studentsEnrolled: number) => {
    const newCourse: Course = {
      id: Date.now(),
      name,
      section,
      professor,
      term,
      studentsEnrolled,
      isPublished: false,
    };
    
    setCourses([...courses, newCourse]);
    saveCoursesToStorage([...courses, newCourse]);
  };

  const setPublished = (id: number, status: boolean) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === id ? { ...course, isPublished: status } : course))
    );
  };

  const deleteCourse = (id: number) => {
    setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
  };

  const updateCourse = (id: number, name: string, section: string, term: string, professor: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id ? { ...course, name, section, term, professor } : course
      )
    );
  };

  return {
    courses,
    setPublished,
    addCourse,
    deleteCourse,
    updateCourse,
  };
};
