"use client";

import React from "react";
import { useProfile } from "@/hooks/useProfile";
import StudentCoursesTable from "@/components/StudentCoursesTable";
import ProfessorCoursesTable from "@/components/ProfessorCoursesTable";
import { ROLES } from "@/constants";

const Dashboard: React.FC = () => {
  const { profile } = useProfile();

  return (
    <div className="container mx-auto p-4">
      {profile?.role === ROLES.STUDENT ? (
        <StudentCoursesTable />
      ) : (
        <ProfessorCoursesTable />
      )}
    </div>
  );
};

export default Dashboard;
