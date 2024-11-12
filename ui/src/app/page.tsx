// src/app/dashboard/page.tsx

"use client";

<<<<<<< HEAD
import React from "react";
=======
import React, {useState, useEffect} from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile } from "@/hooks/useProfile";
import StudentCoursesTable from "@/components/StudentCoursesTable";
import ProfessorCoursesTable from "@/components/ProfessorCoursesTable";
>>>>>>> api-ui-user
import { ROLES } from "@/constants";
import { useProfile } from "@/hooks/useProfile";
import AdminCoursesTable from "@/components/AdminCoursesTable";
import ProfessorCoursesTable from "@/components/ProfessorCoursesTable";
import StudentCoursesTable from "@/components/StudentCoursesTable";
import Link from "next/link";
import { Plus } from "lucide-react";

const Dashboard: React.FC = () => {
  const { profile } = useProfile();
<<<<<<< HEAD

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        {profile?.role === ROLES.ADMIN && (
          <Link href="/course/new">
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2" /> Add Course
            </button>
          </Link>
        )}
      </div>
      {profile?.role === ROLES.ADMIN && <AdminCoursesTable />}
      {profile?.role === ROLES.PROFESSOR && <ProfessorCoursesTable />}
      {profile?.role === ROLES.STUDENT && <StudentCoursesTable />}
=======
  const { courses, setPublished } = useDashboard();
  
  return (
    <div>
      <div className="container mx-auto p-4">
        {profile?.role_id == 8 ? (
          <StudentCoursesTable />
        ) : (
          <ProfessorCoursesTable />
        )}
      </div>
>>>>>>> api-ui-user
    </div>
  );
};

export default Dashboard;
