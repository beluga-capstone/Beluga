"use client";

import StudentListingForSubmission from "@/components/StudentListingForSubmission";
import { useAssignments } from "@/hooks/useAssignments";
import { useUsers } from "@/hooks/useUsers";
import { shortDate, shortTime } from "@/lib/utils";
import { Assignment, Student } from "@/types";
import { useEffect, useState } from "react";

const AssignmentSubmissionsPage = ({
  params,
}: {
  params: { assignmentId: string; submissionId: string };
}) => {
  const { fetchAssignmentsById } = useAssignments();
  const [students, setStudents] = useState<Student[]>([]);
  const { fetchCourseStudents } = useUsers();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const data = await fetchAssignmentsById(params.assignmentId);
        setAssignment(data);
      } catch (err) {
        console.error("Error fetching assignment:", err);
      }
    };

    loadAssignment();
  }, [params.assignmentId, fetchAssignmentsById]);

  useEffect(() => {
    if (!assignment) {
      console.error("Assignment not found");
      setLoading(false);
      return;
    }

    const getStudents = async () => {
      try {
        const data = await fetchCourseStudents(assignment.course_id);
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [assignment]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{assignment?.title}</h1>
        <h2>
          {assignment?.due_at
            ? `Due: ${shortDate(assignment?.due_at)} at ${shortTime(
                assignment?.due_at
              )}`
            : "No due date"}
        </h2>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Submitted?</th>
            <th>Score/100</th>
            <th>Graded?</th>
            <th>Submission Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7}>
              <hr />
            </td>
          </tr>
          {students.map((student) => {
            return (
              <StudentListingForSubmission
                key={student.id}
                student={student}
                assignment={assignment}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentSubmissionsPage;
