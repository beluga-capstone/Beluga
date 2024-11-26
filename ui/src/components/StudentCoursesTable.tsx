import React, { useEffect,useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import Link from "next/link";

interface Course {
  user_id?: string;
  course_id: string;
  name: string;
  studentsEnrolled: number;
  isPublished: boolean;
  term?: string;
  professor?: string;
}

const StudentCoursesTable: React.FC = () => {
  const { searchCourses } = useDashboard();
  const [courses,setCourses] = useState<Course[]|null>(null);

  useEffect(() => {
    const getCourses =async()=>{
      const filters = {};
      const data = await searchCourses(filters);

      setCourses(data);
    }
    getCourses();
    console.log("theeeeee data",courses);

  }, []);

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Course</th>
          <th>Term</th>
        </tr>
      </thead>
      <tbody>
        {courses?.length === 0 ? (
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
            {courses?.map((course) => (
              <tr key={course.course_id}>
                <td className="text-center py-2">
                  <Link href={`/assignments/courses/${course.course_id}`}>
                    {course.name}
                  </Link>
                </td>
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
