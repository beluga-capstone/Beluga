"use client";

import { useUsers } from "@/hooks/useUsers";
import { Edit2 } from "lucide-react";
import Link from "next/link";

const StudentPage = ({ params }: { params: { id: string } }) => {
  const { users } = useUsers();
  const user = users.find((user) => user.id === params.id);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center">
        <h1 className="font-bold text-4xl">
          {user?.firstName} {user?.middleName} {user?.lastName}
        </h1>
        <Link href={`/students/edit/${user?.id}`} className="px-6">
          <Edit2 size={24} />
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-row">
          <h2 className="font-bold pb-4">Email: {user?.email}</h2>
          <h2 className="font-bold pb-4">Role: {user?.role_id}</h2>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
