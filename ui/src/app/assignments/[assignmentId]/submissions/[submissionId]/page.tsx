"use client";

import FilesPreview from "@/components/FilesPreview";
import { DEFAULT_FILES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";

const SubmissionPage = ({
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
      <FilesPreview
        files={DEFAULT_FILES.map((file) => new File([file], "file.py"))}
      />
    </div>
  );
};

export default SubmissionPage;
