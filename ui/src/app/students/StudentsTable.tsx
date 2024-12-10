// StudentsTable.tsx
import { Student,User } from "@/types";
import Link from "next/link";

interface StudentsTableProps {
  students: Student[]|User[]; 
  hasClickableNames?: boolean;
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  hasClickableNames,
}) => {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={5}>
            <hr />
          </td>
        </tr>
        {students.map((student) => (
          <tr key={student.id}>
            <td className="text-center py-2">
              {hasClickableNames ? (
                <Link href={`/students/${student.id}`}>
                  {student.firstName}
                </Link>
              ) : (
                student.firstName
              )}
            </td>
            <td className="text-center py-2">
              {hasClickableNames ? (
                <Link href={`/students/${student.id}`}>{student.lastName}</Link>
              ) : (
                student.lastName
              )}
            </td>
            <td className="text-center py-2">{student.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentsTable;
