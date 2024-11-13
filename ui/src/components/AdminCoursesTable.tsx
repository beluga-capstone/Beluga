import React, { useEffect } from "react";
import { Trash2, Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useUsers } from "@/hooks/useUsers";
import { ROLES } from "@/constants";
import Link from "next/link";

const AdminCoursesTable: React.FC = () => {
  const { courses, setPublished, deleteCourse, addCourse } = useDashboard();
  const { users } = useUsers();

  const isTermActive = (term: string) => {
    const currentDate = new Date();
    const [termSeason, termYear] = term.split(" ");
    const currentYear = currentDate.getFullYear();
    const termYearInt = parseInt(termYear, 10);

    if (termYearInt !== currentYear) {
      return false;
    }

    const currentMonth = currentDate.getMonth();
    switch (termSeason.toLowerCase()) {
      case "spring":
        return currentMonth >= 0 && currentMonth <= 4;
      case "summer":
        return currentMonth >= 5 && currentMonth <= 6;
      case "fall":
        return currentMonth >= 7 && currentMonth <= 11;
      default:
        return false;
    }
  };

  useEffect(() => {
    courses.forEach((course) => {
      const termActive = isTermActive(course.term);
      if (course.isPublished !== termActive) {
        setPublished(course.id, termActive);
      }
    });
  }, [courses, setPublished]);

  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Course</th>
            <th>Section</th>
            <th>Professor</th>
            <th>Term</th>
            <th>Students Enrolled</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7}>
              <hr />
            </td>
          </tr>
          {courses.map((course) => {
            const studentsEnrolled = users.filter(
              (user) => user.role === ROLES.STUDENT && user.courseId === course.id
            ).length;

            return (
              <tr key={course.id}>
                <td className="text-center py-2">
                  <Link
                    href={`/assignments/courses/${course.id}?courseId=${course.id}&name=${encodeURIComponent(
                      course.name
                    )}`}
                  >
                    <span className="cursor-pointer text-white-600">
                      {course.name}
                    </span>
                  </Link>
                </td>
                <td className="text-center py-2">{course.section}</td>
                <td className="text-center py-2">{course.professor}</td>
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
