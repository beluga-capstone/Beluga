import { useDashboard } from "@/hooks/useDashboard";
import { ToggleLeft, ToggleRight } from "lucide-react";

const ProfessorCoursesTable: React.FC = () => {
  const { courses, setPublished } = useDashboard();

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Course</th>
          <th>Section</th>
          <th>Term</th>
          <th>Students Enrolled</th>
          <th>Published</th>
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
            <td className="text-center py-2">{course.name}</td>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProfessorCoursesTable;
