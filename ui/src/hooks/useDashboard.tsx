import { useState } from "react";

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
  // State for storing courses
  const [courses, setCourses] = useState<Course[]>([]);

  // Function to fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      const transformedCourses = data.map((course: any) => ({
        id: course.course_id,
        name: course.name,
        section: course.section || 0,
        term: course.term_id || "Unknown Term",
        studentsEnrolled: course.studentsEnrolled || 0,
        isPublished: course.publish || false,
        professor: course.professor || "Unknown",
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Function to add a course
  const addCourse = async (
    title: string,
    section: string,
    professorId: string,
    termId: string,
    description: string,
    studentsEnrolled: number
  ) => {
    const newCourse = {
      name: title,
      user_id: professorId, // UUID of the professor
      description,
      publish: false,
      start_at: new Date().toISOString(),
      term_id: termId, // UUID of the term
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
      await fetchCourses(); // Refresh the list of courses
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  // Function to update a course
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

  // Function to set a course as published/unpublished
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

  // Function to delete a course
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
