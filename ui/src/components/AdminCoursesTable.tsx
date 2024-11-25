import React, { useEffect, useState } from "react";
import { Trash2, Edit2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useUsers } from "@/hooks/useUsers";
import { Course } from "@/types";
import Link from "next/link";

const AdminCoursesTable: React.FC = () => {
  const { courses, fetchCourses, setPublished, deleteCourse } = useDashboard();
  const { fetchUserById } = useUsers();
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [studentCounts, setStudentCounts] = useState<{ [key: string]: number }>({});

  // Fetch instructor names for courses
  useEffect(() => {
    const loadUsernames = async () => {
      const usernameMap: { [key: string]: string } = {};

      for (const course of courses) {
        if (course.user_id && !usernameMap[course.user_id]) {
          const user = await fetchUserById(course.user_id);
          if (user) {
            usernameMap[course.user_id] = `${user.firstName} ${user.lastName || ""}`.trim();
          } else {
            usernameMap[course.user_id] = "Unknown User";
          }
        }
      }
      setUsernames(usernameMap);
    };

    if (courses.length > 0) {
      loadUsernames();
    }
  }, [courses, fetchUserById]);

  useEffect(() => {
    const loadCourses = async () => {
      await fetchCourses();
    };
    loadCourses();
  }, [fetchCourses]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Courses</h2>
        <Link href="/course/new">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded">
            <Plus className="mr-2" />
            Add Course
          </button>
        </Link>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Course</th>
            <th>Instructor</th>
            <th>Term</th>
            <th>Students Enrolled</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course: Course) => (
            <tr key={course.id}>
              <td className="text-center py-2">
                <Link href={`/assignments/courses/${course.id}`}>
                  {course.name}
                </Link>
              </td>
              <td className="text-center py-2">{usernames[course.user_id || ""] || "Loading..."}</td>
              <td className="text-center py-2">{course.term}</td>
              <td className="text-center py-2">{course.studentsEnrolled}</td>
              <td className="text-center py-2">
                <div className="flex justify-center items-center cursor-pointer">
                  {course.isPublished ? (
                    <ToggleRight
                      size={32}
                      className="text-green-500"
                      onClick={() => setPublished(course.id, false)}
                    />
                  ) : (
                    <ToggleLeft
                      size={32}
                      className="text-red-500"
                      onClick={() => setPublished(course.id, true)}
                    />
                  )}
                </div>
              </td>
              <td className="text-center py-2 flex space-x-4 justify-center">
                <Link href={`/course/edit/${course.id}`}>
                  <button className="py-2 text-blue-500">
                    <Edit2 size={20} />
                  </button>
                </Link>
                <button
                  className="text-red-500"
                  onClick={() => deleteCourse(course.id)}
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCoursesTable;
