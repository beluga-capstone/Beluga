import { User } from "@/types";
import Link from "next/link";

interface StudentsTableProps {
  students: User[];
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
          <th>Middle Name</th>
          <th>Email</th>
          <th>Role</th>
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
            <td className="text-center py-2">
              {hasClickableNames ? (
                <Link href={`/students/${student.id}`}>
                  {student.middleName}
                </Link>
              ) : (
                student.middleName
              )}
            </td>
            <td className="text-center py-2">{student.email}</td>
            <td className="text-center py-2">{student.role_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentsTable;
