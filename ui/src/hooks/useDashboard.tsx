import { useState } from "react";
import { DEFAULT_COURSES } from "@/constants";

interface Course {
  id: number;
  name: string;
  section: number;
  term: string;
  studentsEnrolled: number;
  isPublished: boolean;
  professor: string;
}

export const useDashboard = () => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addCourse = async (
    title: string,
    section: string,
    professor: string,
    semester: string,
    studentsEnrolled: number
  ) => {
    const newCourse = {
      name: title,
      section: parseInt(section, 10),
      professor,
      term: semester,
      studentsEnrolled,
    };

    try {
      const response = await fetch("http://localhost:5000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }
      await fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const updateCourse = async (
    id: number,
    title: string,
    section: string | number,
    semester: string,
    professor: string
  ) => {
    try {
      const updatedCourse = {
        id,
        title,
        section,
        semester,
        professor,
      };
  
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCourse),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update course");
      }
  
      await fetchCourses(); // Refresh courses
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };
  

  const setPublished = async (id: number, status: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update publish status");
      }

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === id ? { ...course, isPublished: status } : course
        )
      );
    } catch (error) {
      console.error("Error updating publish status:", error);
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return {
    courses,
    fetchCourses,
    addCourse,
    updateCourse,
    setPublished,
    deleteCourse,
  };
};
