"use client";

import { useEffect, useState } from "react";
import { useAssignments } from "@/hooks/useAssignments";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProfessorAssignmentsTable from "@/components/ProfessorAssignmentsTable";
import StudentAssignmentsTable from "@/components/StudentAssignmentsTable";
import { Assignment } from "@/types";

const CourseAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchAssignmentsByCourseId, setPublished, setLateSubmissions } =
    useAssignments();

  const resolvedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;

  // Determine role from query parameters
  const role = searchParams.get("role") || "professor";

  useEffect(() => {
    if (!resolvedCourseId) {
      console.error("No courseId provided");
      router.push("/assignments");
      return;
    }

    const loadAssignments = async () => {
      try {
        console.log(`Loading assignments for courseId: ${resolvedCourseId}`);
        const fetchedAssignments = await fetchAssignmentsByCourseId(
          resolvedCourseId
        );

        // Filter assignments to only include published ones for students
        const filteredAssignments =
          role === "student"
            ? fetchedAssignments.filter((assignment) => assignment.is_published)
            : fetchedAssignments;

        console.log("Filtered assignments:", filteredAssignments);
        setAssignments(filteredAssignments);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }
    };

    loadAssignments();
  }, [resolvedCourseId, role, router]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-4xl">Assignments</h1>
        {role === "professor" && (
          <Link href={`/assignments/new?courseId=${resolvedCourseId}`}>
            <Button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2" /> Add Assignment
            </Button>
          </Link>
        )}
      </div>
      {role === "student" ? (
        <StudentAssignmentsTable assignments={assignments} />
      ) : (
        <ProfessorAssignmentsTable
          assignments={assignments}
          setPublished={setPublished}
          setLateSubmissions={setLateSubmissions}
        />
      )}
    </div>
  );
};

export default CourseAssignments;
