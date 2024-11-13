"use client";

import React, {useState, useEffect} from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile } from "@/hooks/useProfile";
import StudentCoursesTable from "@/components/StudentCoursesTable";
import ProfessorCoursesTable from "@/components/ProfessorCoursesTable";
import { ROLES } from "@/constants";

const Dashboard: React.FC = () => {
  const { profile } = useProfile();
  const { courses, setPublished } = useDashboard();
  
  return (
    <div>
      <div className="container mx-auto p-4">
        {profile?.role_id == ROLES.STUDENT ? (
          <StudentCoursesTable />
        ) : (
          <ProfessorCoursesTable />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
