import { useState } from "react";

interface Course {
  user_id?: string;
  id: string;
  name: string;
  studentsEnrolled: number;
  isPublished: boolean;
  term?: string;
  professor?: string;
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
      const transformedCourses = data.map((course: any) => ({
        id: course.course_id,
        name: course.name,
        user_id: course.user_id,
        studentsEnrolled: course.studentsEnrolled || 0,
        isPublished: course.publish || false,
        term: course.term || "Fall 2024",
        professor: course.professor || "Unknown",
      }));
      setCourses(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addCourse = async (
    title: string,
    studentsEnrolled: number,
    userId: string,
    publish: boolean = false
  ) => {
    const newCourse = {
      name: title,
      studentsEnrolled,
      user_id: userId,
      publish,
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

  const setPublished = async (id: string, status: boolean) => {
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
    setPublished,
    deleteCourse,
  };
};
