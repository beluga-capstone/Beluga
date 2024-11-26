import React, { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { useUsers } from "@/hooks/useUsers";

const ProfessorCoursesTable: React.FC = () => {
  const { setPublished, deleteCourse } = useDashboard(); 
  const { fetchUserById } = useUsers(); 
  const [courses, setCourses] = useState<any[]>([]); 
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${process.env.backend}/courses/search`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data); // Populate courses
        console.log("Fetched courses for professor:", data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Professor's Courses</h2>
        <Link href="/course/new">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded">
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
                <tr key={course.course_id}>
                  <td className="text-center py-2">
                    <Link href={`/assignments/courses/${course.course_id}`}>
                      {course.name}
                    </Link>
                  </td>
                  <td className="text-center py-2">
                    {usernames[course.user_id || ""] || "Loading..."}
                  </td>
                  <td className="text-center py-2">{course.term_id || "Fall 2024"}</td>
                  <td className="text-center py-2">{course.students_count || 0}</td>
                  <td className="text-center py-2">
                    <div className="flex justify-center items-center cursor-pointer">
                      {course.publish ? (
                        <ToggleRight
                          size={32}
                          className="text-green-500"
                          onClick={() => setPublished(course.course_id, false)}
                        />
                      ) : (
                        <ToggleLeft
                          size={32}
                          className="text-red-500"
                          onClick={() => setPublished(course.course_id, true)}
                        />
                      )}
                    </div>
                  </td>
                  <td className="text-center py-2 flex space-x-4 justify-center">
                    <Link href={`/course/edit/${course.course_id}`}>
                      <button className="py-2 text-blue-500">
                        <Edit2 size={20} />
                      </button>
                    </Link>
                    <button
                      className="text-red-500"
                      onClick={() => deleteCourse(course.course_id)}
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
