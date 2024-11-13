import { useState, useEffect } from "react";
import { ROLES } from "@/constants";
import { User } from "@/types";

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
  if (typeof window === "undefined") {
    return [];
  }
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

  const updateCourseEnrollment = (courseId: number, increment: number) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, studentsEnrolled: course.studentsEnrolled + increment }
          : course
      );
      saveCoursesToStorage(updatedCourses);
      return updatedCourses;
    });
  };

  const addCourse = (
    name: string,
    section: string,
    professor: string,
    term: string,
    users: User[] = [] // Accept users as a parameter and ensure it's an array
  ) => {
    const courseId = Date.now();
    const studentsEnrolled = Array.isArray(users)
      ? users.filter((user) => user.role === ROLES.STUDENT && user.courseId === courseId).length
      : 0; // If `users` is not an array, fallback to 0

    const newCourse: Course = {
      id: courseId,
      name,
      section,
      professor,
      term,
      studentsEnrolled,
      isPublished: false,
    };

    setCourses((prevCourses) => [...prevCourses, newCourse]);
    saveCoursesToStorage([...courses, newCourse]);
  };

  const setPublished = (id: number, status: boolean) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id ? { ...course, isPublished: status } : course
      )
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
    updateCourseEnrollment,
    setPublished,
    addCourse,
    deleteCourse,
    updateCourse,
  };
};
