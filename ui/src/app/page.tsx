"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile } from "@/hooks/useProfile";
import StudentCoursesTable from "@/components/StudentCoursesTable";
import ProfessorCoursesTable from "@/components/ProfessorCoursesTable";
import AdminCoursesTable from "@/components/AdminCoursesTable";
import { ROLES } from "@/constants";
import Link from "next/link";
import { Plus } from "lucide-react";

const Dashboard: React.FC = () => {
  const { profile } = useProfile();
  const { courses, setPublished } = useDashboard();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        {profile?.role_id === ROLES.ADMIN && (
          <Link href="/course/new">
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2" /> Add Course
            </button>
          </Link>
        )}
      </div>
      {profile?.role_id === ROLES.ADMIN && (
        <AdminCoursesTable courses={courses} setPublished={setPublished} />
      )}
      {profile?.role_id === ROLES.PROFESSOR && <ProfessorCoursesTable />}
      {profile?.role_id === ROLES.STUDENT && <StudentCoursesTable />}
    </div>
  );
};

export default Dashboard;
