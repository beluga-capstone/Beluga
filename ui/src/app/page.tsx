"use client";

import React, {useState, useEffect} from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile } from "@/hooks/useProfile";
import StudentCoursesTable from "@/components/StudentCoursesTable";
import ProfessorCoursesTable from "@/components/ProfessorCoursesTable";
import AdminCoursesTable from "@/components/AdminCoursesTable";
import { ROLES } from "@/constants";

const Dashboard: React.FC = () => {
  const { profile } = useProfile();
  
  return (
    <div>
      <div className="container mx-auto p-4">
        {profile?.role_id === ROLES.ADMIN && <AdminCoursesTable />}
        {profile?.role_id === ROLES.PROFESSOR && <ProfessorCoursesTable />}
        {profile?.role_id === ROLES.STUDENT && <StudentCoursesTable />}
      </div>
    </div>
  );
};

export default Dashboard;