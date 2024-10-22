"use client";

import Link from "next/link";
import SubmissionPage from "./page";
import { useAssignments } from "@/hooks/useAssignments";

const SubmissionLayout = ({
  params,
}: {
  params: { assignmentId: string; submissionId: string };
}) => {
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(params.assignmentId, 10)
  );
  const studentFirstName = "Bode";
  const studentLastName = "Raymond";

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{assignment?.title}</h1>
        <h2>
          Due:{" "}
          {assignment?.dueDate.toLocaleDateString("en-US", {
            dateStyle: "short",
            timeZone: "UTC",
          })}
        </h2>
      </div>
      <h2 className="text-2xl pb-8">
        {studentFirstName} {studentLastName}
      </h2>
      <div className="flex">
        <h2 className="text-xl">Files:</h2>
        <ul className="px-8">
          <li>
            <Link
              href={`/assignments/${params.assignmentId}/submissions/${params.submissionId}/files/1`}
            >
              file1.py
            </Link>
          </li>
          <li>
            <Link
              href={`/assignments/${params.assignmentId}/submissions/${params.submissionId}/files/2`}
            >
              file2.py
            </Link>
          </li>
        </ul>
        <SubmissionPage />
      </div>
    </div>
  );
};

export default SubmissionLayout;
