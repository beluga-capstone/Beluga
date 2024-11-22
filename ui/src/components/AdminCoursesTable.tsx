import React, { useEffect, useState } from "react";
import { Trash2, Edit2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import Link from "next/link";

const AdminCoursesTable: React.FC = () => {
  const { courses, fetchCourses, setPublished, deleteCourse } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        await fetchCourses();
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
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
            <th>Professor</th>
            <th>Students Enrolled</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="text-center py-2">{course.name}</td>
              <td className="text-center py-2">{course.professor}</td>
              <td className="text-center py-2">{course.studentsEnrolled}</td>
              <td className="text-center py-2">
                {course.isPublished ? (
                  <ToggleRight
                    size={32}
                    className="text-green-500 cursor-pointer"
                    onClick={async () => {
                      try {
                        await setPublished(course.id, false);
                      } catch (error) {
                        console.error("Failed to update publish status:", error);
                      }
                    }}
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500 cursor-pointer"
                    onClick={async () => {
                      try {
                        await setPublished(course.id, true);
                      } catch (error) {
                        console.error("Failed to update publish status:", error);
                      }
                    }}
                  />
                )}
              </td>
              <td className="text-center py-2 flex space-x-4 justify-center">
                <Link href={`/course/edit/${course.id}`}>
                  <button className="py-2 text-blue-500">
                    <Edit2 size={20} />
                  </button>
                </Link>
                <button
                  className="text-red-500"
                  onClick={async () => {
                    try {
                      await deleteCourse(course.id);
                    } catch (error) {
                      console.error("Failed to delete course:", error);
                    }
                  }}
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
