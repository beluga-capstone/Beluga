"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types";

export const useDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch all courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      const transformedData = data.map((course: Course) => ({
        id: course.id,
        name: course.name,
        section: course.section,
        professor: course.professor,
        term: course.term,
        studentsEnrolled: course.studentsEnrolled,
        isPublished: course.isPublished,
      }));
      setCourses(transformedData); // Update state with the latest data
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Save a new course to the database
  const saveCourse = async (newCourse: Course) => {
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

      const savedCourse = await response.json();
      setCourses((prev) => [...prev, savedCourse]); // Update state with the new course
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new course using saveCourse
  const addCourse = async (
    name: string,
    section: number,
    professor: string,
    term: string
  ) => {
    const newCourse = {
      name,
      section,
      professor,
      term,
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
  
      const savedCourse = await response.json();
      setCourses((prev) => [...prev, savedCourse]);
    } catch (err) {
      console.error(err);
    }
  };
  

  const updateCourse = async (
    id: number,
    name: string,
    section: number,
    professor: string,
    term: string,
    isPublished: boolean
  ) => {
    const existingCourse = courses.find((course) => course.id === id);
    if (!existingCourse) {
      throw new Error("Course not found");
    }

    const updatedCourse: Course = {
      id,
      name,
      section,
      professor,
      term,
      studentsEnrolled: existingCourse.studentsEnrolled,
      isPublished,
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

      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? updatedCourse : course
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a course
  const deleteCourse = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Publish or unpublish a course
  const setPublished = async (id: number, isPublished: boolean) => {
    try {
      const updatedCourse = { isPublished };

      const response = await fetch(`http://localhost:5000/courses/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to update publish status");
      }

      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, isPublished } : course
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return {
    courses,
    fetchCourses,
    saveCourse, // Exposed for potential reuse
    addCourse,
    updateCourse,
    deleteCourse,
    setPublished,
  };
};
