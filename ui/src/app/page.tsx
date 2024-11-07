// src/app/dashboard/page.tsx

"use client";

import React from "react";
import { ROLES } from "@/constants";
import { useProfile } from "@/hooks/useProfile";
import AdminCoursesTable from "@/components/AdminCoursesTable";
import ProfessorCoursesTable from "@/components/ProfessorCoursesTable";
import StudentCoursesTable from "@/components/StudentCoursesTable";
import Link from "next/link";
import { Plus } from "lucide-react";

const Dashboard: React.FC = () => {
  const { profile } = useProfile();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        {profile?.role === ROLES.ADMIN && (
          <Link href="/courses/new">
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2" /> Add Course
            </button>
          </Link>
        )}
      </div>
      {profile?.role === ROLES.ADMIN && <AdminCoursesTable />}
      {profile?.role === ROLES.PROFESSOR && <ProfessorCoursesTable />}
      {profile?.role === ROLES.STUDENT && <StudentCoursesTable />}
    </div>
  );
};

export default Dashboard;