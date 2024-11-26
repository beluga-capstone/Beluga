import React, { useEffect } from "react";
import { useDashboard } from "@/hooks/useDashboard";

const StudentCoursesTable: React.FC = () => {
  const { courses, searchCourses } = useDashboard();

  useEffect(() => {
    // Fetch courses when the component mounts
    const filters = {}; // Add filters here if needed, e.g., { term: "Spring 2024" }
    searchCourses(filters);
  }, [searchCourses]);

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Course</th>
          <th>Term</th>
          {/* <th>Term</th> */}
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
                <td className="text-center py-2">{course.term || "N/A"}</td>
                {/* <td className="text-center py-2">{course.term_id || "N/A"}</td> */}
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};

export default StudentCoursesTable;
