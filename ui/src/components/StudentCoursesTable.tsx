import { useDashboard } from "@/hooks/useDashboard";

const StudentCoursesTable: React.FC = () => {
  const { courses } = useDashboard();

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Course</th>
          <th>Section</th>
          <th>Term</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={3}>
            <hr />
          </td>
        </tr>
        {courses.map((course) => (
          <tr key={course.id}>
            <td className="text-center py-2">{course.name}</td>
            <td className="text-center py-2">{course.term}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentCoursesTable;
