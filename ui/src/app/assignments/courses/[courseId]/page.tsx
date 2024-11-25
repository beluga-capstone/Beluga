"use client";

import { useEffect, useState } from "react";
import { useAssignments } from "@/hooks/useAssignments";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProfessorAssignmentsTable from "@/components/ProfessorAssignmentsTable";
import { Assignment } from "@/types";

const CourseAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { courseId } = useParams(); 
  const router = useRouter();
  const {fetchAssignmentsByCourseId} = useAssignments();

  const resolvedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;

  useEffect(() => {
    if (!resolvedCourseId) {
      console.error("No courseId provided");
      router.push("/assignments");
      return;
    }

    const loadAssignments = async () => {
      try {
        console.log(`Loading assignments for courseId: ${resolvedCourseId}`);
        const fetchedAssignments = await fetchAssignmentsByCourseId(resolvedCourseId);
        console.log("Fetched assignments:", fetchedAssignments);

        // Filter assignments by courseId
        const filteredAssignments = fetchedAssignments.filter(
          (assignment) => assignment.course_id === resolvedCourseId
        );
        console.log("Filtered assignments:", filteredAssignments);

        setAssignments(filteredAssignments);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }
    };

    loadAssignments();
  }, [resolvedCourseId, router]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-4xl">Assignments</h1>
        <Link href={`/assignments/new?courseId=${resolvedCourseId}`}>
          <Button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Plus className="mr-2" /> Add Assignment
          </Button>
        </Link>
      </div>
      <ProfessorAssignmentsTable/>
    </div>
  );
};

export default CourseAssignments;
