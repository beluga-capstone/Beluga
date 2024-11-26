import React, { useEffect } from "react";
import { useDashboard } from "@/hooks/useDashboard";

const StudentCoursesTable: React.FC = () => {
  const { courses, searchCourses } = useDashboard();

  useEffect(() => {
    const filters = {};
    searchCourses(filters);
  }, [searchCourses]);

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Course</th>
          <th>Term</th>
        </tr>
      </thead>
      <tbody>
        {courses.length === 0 ? (
          <tr>
            <td colSpan={2} className="text-center py-4">
              No courses found.
            </td>
          </tr>
        ) : (
          <>
            <tr>
              <td colSpan={2}>
                <hr />
              </td>
            </tr>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="text-center py-2">{course.name}</td>
                <td className="text-center py-2">{course.term || "Fall 2024"}</td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};

export default StudentCoursesTable;
