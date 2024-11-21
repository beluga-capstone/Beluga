import React from "react";
import { Course } from "@/types";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface AdminCoursesTableProps {
  courses: Course[];
  setPublished: (id: number, isPublished: boolean) => void;
}

const AdminCoursesTable: React.FC<AdminCoursesTableProps> = ({
  courses,
  setPublished,
}) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Course Name</th>
          <th className="px-4 py-2">Section</th>
          <th className="px-4 py-2">Professor</th>
          <th className="px-4 py-2">Term</th>
          <th className="px-4 py-2">Published</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={5}>
            <hr />
          </td>
        </tr>
        {courses.map((course) => (
          <tr key={course.id}>
            <td className="border px-4 py-2 text-center">{course.name}</td>
            <td className="border px-4 py-2 text-center">{course.section}</td>
            <td className="border px-4 py-2 text-center">{course.professor}</td>
            <td className="border px-4 py-2 text-center">{course.term}</td>
            <td className="border px-4 py-2 text-center">
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminCoursesTable;
