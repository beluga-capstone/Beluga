import { useProfile } from "@/hooks/useProfile";
import { useSubmissions } from "@/hooks/useSubmissions";
import { shortDate, shortTime } from "@/lib/utils";
import { Assignment } from "@/types";
import Link from "next/link";
import { useEffect } from "react";

interface ListingForSubmissionProps {
  assignment: Assignment;
}

const ListingForSubmission: React.FC<ListingForSubmissionProps> = ({
  assignment,
}) => {
  const { profile } = useProfile();
  const { assignmentIsSubmitted, getLatestSubmission } = useSubmissions();
  const latestSubmission = profile
    ? getLatestSubmission(assignment.assignment_id, profile.user_id)
    : null;

  useEffect(() => {
    if (profile) {
      getLatestSubmission(assignment.assignment_id, profile.user_id);
    }
  }, [profile]);

  return (
    <tr key={assignment.assignment_id}>
      <td className="text-center py-2">
        <Link href={`/assignments/${assignment.assignment_id}`}>
          {assignment.title}
        </Link>
      </td>
      <td className="text-center py-2">
        {assignment?.publish_at
          ? `${shortDate(assignment.publish_at)} at ${shortTime(
              assignment.publish_at
            )}`
          : "-"}
      </td>
      <td className="text-center py-2">
        {assignment?.due_at
          ? `${shortDate(assignment.due_at)} at ${shortTime(assignment.due_at)}`
          : "-"}
      </td>

      <td className="text-center py-2">
        {profile &&
        assignmentIsSubmitted(assignment.assignment_id, profile?.user_id)
          ? "Yes"
          : "No"}
      </td>

      <td className="text-center py-2">
        {latestSubmission?.status === "graded" ? latestSubmission?.grade : "-"}
      </td>

      <td className="text-center py-2">
        {latestSubmission?.status === "graded" ? "Yes" : "No"}
      </td>

      <td className="text-center py-2">
        {latestSubmission
          ? `${shortDate(latestSubmission.submitted_at)} at ${shortTime(
              latestSubmission.submitted_at
            )}`
          : "-"}
      </td>
    </tr>
  );
};

export default ListingForSubmission;
