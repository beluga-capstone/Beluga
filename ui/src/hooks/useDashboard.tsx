import { useState } from "react";

interface Course {
  id: string; // Use course_id from the database
  name: string;
  section: number;
  term: string;
  studentsEnrolled: number;
  isPublished: boolean;
  professor: string; // Include professor
}

export const useDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();

      // Transform API response
      const transformedCourses = data.map((course: any) => ({
        id: course.course_id,
        name: course.name,
        term: course.term_id || "Unknown Term",
        professor: course.user_id || "Unknown Professor",
        studentsEnrolled: course.studentsEnrolled || 0,
        isPublished: course.publish || false,
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addCourse = async (
    name: string,
    term: string,
    professor: string,
    studentsEnrolled: number
  ) => {
    const newCourse = {
      name,
      term_id: term,
      user_id: professor, // Professor UUID
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
  
      const data = await response.json(); // Get the created course
      await fetchCourses(); // Refresh courses
      return data; // Return the created course object
    } catch (error) {
      console.error("Error adding course:", error);
      throw error; // Rethrow to be caught in `handleAddCourse`
    }
  };

  const updateCourse = async (id: string, name: string, term: string, professor: string) => {
    const updatedCourse = {
      name,
      term,
      user_id: professor, // Maps `professor` to `user_id`
    };
  
    try {
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
      await fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const setPublished = async (id: string, status: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publish: status }),
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

  const deleteCourse = async (id: string) => {
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
