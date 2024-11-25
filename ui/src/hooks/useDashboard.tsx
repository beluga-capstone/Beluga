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

  const fetchStudentCounts = async (): Promise<{ [courseId: string]: number }> => {
    try {
      const counts: { [courseId: string]: number } = {};
  
      for (const course of courses) {
        const response = await fetch(`http://localhost:5000/courses/${course.id}/students/count`);
        if (!response.ok) {
          console.error(`Failed to fetch student count for course ${course.id}`);
          continue;
        }
  
        const data = await response.json();
        counts[course.id] = data.students_count || 0;
      }
  
      return counts;
    } catch (error) {
      console.error("Error fetching student counts:", error);
      return {};
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/courses");
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
  ): Promise<{ course_id: string } | null> => { // Fix: Expect course_id
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
  
      const data = await response.json();
      return data; // Ensure course_id is returned
    } catch (error) {
      console.error("Error adding course:", error);
      return null;
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
