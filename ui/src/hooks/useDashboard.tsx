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

  const searchCourses = async (filters: Record<string, string> = {}) => {
    try {
      // const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:5000/courses/search`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const data = await response.json();

      const changedCourse = data.map((course: any) => ({
        id: course.course_id,
        name: course.name,
        term: course.term || "Fall 2024", // Provide default term if not available
        user_id: course.user_id,
        studentsEnrolled: course.studentsEnrolled || 0,
        isPublished: course.publish || false,
        professor: course.professor || "Unknown", // Adjusted to avoid missing fields
      }));

      console.log("Fetched courses:", data); // Debugging log
      setCourses(changedCourse);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudentCounts = async (): Promise<{
    [courseId: string]: number;
  }> => {
    try {
      const counts: { [courseId: string]: number } = {};

      for (const course of courses) {
        const response = await fetch(
          `http://localhost:5000/courses/${course.id}/students/count`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          console.error(
            `Failed to fetch student count for course ${course.id}`
          );
          continue;
        }

        const data = await response.json();
        counts[course.id] = data.students_count || 0;
        console.log("counts: ", counts);
      }

      return counts;
    } catch (error) {
      console.error("Error fetching student counts:", error);
      return {};
    }
  };

  const getCourse = async (id: string): Promise<Course | null> => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch course details");
      }

      const data = await response.json();
      const course: Course = {
        id: data.course_id,
        name: data.name,
        user_id: data.user_id,
        studentsEnrolled: 0, // This would need to be fetched separately if needed
        isPublished: data.publish,
        term: data.term_id || "Fall 2024",
        professor: data.description || "Unknown", // Assuming professor info might be in description
      };

      return course;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/courses/search", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data: Array<any> = await response.json();
      const transformedCourses = data.map((course: any) => ({
        id: course.course_id,
        name: course.name,
        user_id: course.user_id,
        studentsEnrolled: 0, // Temporary value; updated below
        isPublished: course.publish || false,
        term: course.term || "Fall 2024",
        professor: course.professor || "Unknown",
      }));

      const counts = await fetchStudentCounts(); // Fetch student counts
      transformedCourses.forEach((course) => {
        course.studentsEnrolled = counts[course.id] || 0;
      });

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
  ): Promise<{ course_id: string } | null> => {
    // Fix: Expect course_id
    const newCourse = {
      name: title,
      studentsEnrolled,
      user_id: userId,
      publish,
    };

    try {
      const response = await fetch("http://localhost:5000/courses", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      const data = await response.json();
      fetchCourses();
      return data; // Ensure course_id is returned
    } catch (error) {
      console.error("Error adding course:", error);
      return null;
    }
  };

  const updateCourse = async (id: string, updatedData: { name: string }) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      const updatedCourse = await response.json();

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === id ? { ...course, name: updatedData.name } : course
        )
      );
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const setPublished = async (id: string, status: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:5000/courses/${id}/publish`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublished: status }),
        }
      );

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
        credentials: "include",
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
    searchCourses,
    addCourse,
    updateCourse,
    setPublished,
    deleteCourse,
    getCourse,
  };
};
