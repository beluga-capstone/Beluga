import React, { useEffect, useState } from "react";
import { Trash2, Edit2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useUsers } from "@/hooks/useUsers";
import { ROLES } from "@/constants";
import Link from "next/link";

const AdminCoursesTable: React.FC = () => {
  const { courses, fetchCourses, setPublished, deleteCourse } = useDashboard();
  const { users } = useUsers();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      await fetchCourses();
      setLoading(false);
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
            <th>Section</th>
            <th>Term</th>
            <th>Students Enrolled</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const studentsEnrolled = users.filter(
              (user) =>
                parseInt(user.role) === ROLES.STUDENT &&
                user.courseId === course.id
            ).length;

            return (
              <tr key={course.id}>
                <td className="text-center py-2">
                  <Link
                    href={`/assignments/courses/${course.id}?courseId=${course.id}&name=${encodeURIComponent(
                      course.name
                    )}`}
                  >
                    <span className="cursor-pointer text-white">
                      {course.name}
                    </span>
                  </Link>
                </td>
                <td className="text-center py-2">{course.section}</td>
                <td className="text-center py-2">{course.term}</td>
                <td className="text-center py-2">{studentsEnrolled}</td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCoursesTable;
