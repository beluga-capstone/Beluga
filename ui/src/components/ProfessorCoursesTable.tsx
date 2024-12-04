import React, { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight, Plus,Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { useUsers } from "@/hooks/useUsers";

const ProfessorCoursesTable: React.FC = () => {
  const { setPublished, deleteCourse, fetchStudentCounts, fetchCourses, courses } = useDashboard(); 
  const { fetchUserById } = useUsers(); 
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [courseStudentCounts, setCourseStudentCounts] = useState<{[key:string]:number}>({});

  useEffect(() => {
    const loadCoursesAndCounts = async () => {
      await fetchCourses();
      const studentCounts = await fetchStudentCounts(); 
      setCourseStudentCounts(studentCounts);
    };

    loadCoursesAndCounts();
  }, [fetchCourses, fetchStudentCounts]);

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

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-bold text-4xl mb-6">Courses</h1>
        <Link href="/course/new">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded">
            <Plus className="mr-2" />
            Add Course
          </button>
        </Link>
      </div>
      <br/>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Course</th>
            <th>Instructor</th>
            <th>Term</th>
            <th>Students Enrolled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No courses found.
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td colSpan={6}>
                  <hr className="border-gray-300" />
                </td>
              </tr>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="text-center py-2">
                    <Link href={`/assignments/courses/${course.id}`}>
                      {course.name}
                    </Link>
                  </td>
                  <td className="text-center py-2">
                    {usernames[course.user_id || ""] || "Loading..."}
                  </td>
                  <td className="text-center py-2">{course.term || "Fall 2024"}</td>
                  <td className="text-center py-2">{courseStudentCounts[course.id] || 0}</td>
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
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessorCoursesTable;
