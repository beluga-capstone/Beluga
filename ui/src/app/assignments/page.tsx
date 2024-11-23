"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import { useProfile } from "@/hooks/useProfile";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProfessorAssignmentsTable from "@/components/ProfessorAssignmentsTable";
import StudentAssignmentsTable from "@/components/StudentAssignmentsTable";

const Assignments: React.FC = () => {
  const { profile } = useProfile();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">Assignments</h1>
        {profile?.role_id !== ROLES.STUDENT && (
          <Link href="/assignments/new">
            <Button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2" /> Add Assignment
            </Button>
          </Link>
        )}
      </div>
      {profile?.role_id === ROLES.STUDENT ? (
        <StudentAssignmentsTable />
      ) : (
        <ProfessorAssignmentsTable />
      )}
    </div>
  );
};

export default Assignments;
