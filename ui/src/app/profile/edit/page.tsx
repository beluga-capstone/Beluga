"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";

const EditProfilePage = () => {
  const { profile, updateProfile } = useProfile();
  const [newFirstName, setNewFirstName] = useState(profile?.firstName || "");
  const [newMiddleName, setNewMiddleName] = useState(profile?.middleName || "");
  const [newLastName, setNewLastName] = useState(profile?.lastName || "");
  const [newEmail, setNewEmail] = useState(profile?.email || "");
  const [newRole, setNewRole] = useState(profile?.role || ROLES.STUDENT);

  useEffect(() => {
    setNewFirstName(profile?.firstName || "");
    setNewMiddleName(profile?.middleName || "");
    setNewLastName(profile?.lastName || "");
    setNewEmail(profile?.email || "");
    setNewRole(profile?.role || ROLES.STUDENT);
  }, [profile]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl pb-8">Edit Profile</h1>
      <div className="flex space-x-4">
        <div className="pr-8">
          <h2>First Name</h2>
          <div className="pt-2 pb-8">
            <input
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              type="text"
              className="border rounded p-1 bg-surface"
              placeholder="First name"
              aria-label="First name"
            />
          </div>
        </div>

        <div className="pr-8">
          <h2>Middle Name</h2>
          <div className="pt-2 pb-8">
            <input
              value={newMiddleName}
              onChange={(e) => setNewMiddleName(e.target.value)}
              type="text"
              className="border rounded p-1 bg-surface"
              placeholder="Middle name"
              aria-label="Middle name"
            />
          </div>
        </div>

        <div>
          <h2>Last Name</h2>
          <div className="pt-2 pb-8">
            <input
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              type="text"
              className="border rounded p-1 bg-surface"
              placeholder="Last name"
              aria-label="Last name"
            />
          </div>
        </div>
      </div>

      <h2>Email</h2>
      <div className="pt-2 pb-8">
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          type="text"
          className="border rounded p-1 bg-surface"
          placeholder="Email"
          aria-label="Email"
        />
      </div>

      <h2>Role</h2>
      <div className="pt-2 pb-8">
        <select
          title="Role"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border rounded p-1 bg-surface"
        >
          <option value={ROLES.STUDENT}>{ROLES.STUDENT}</option>
          <option value={ROLES.TA}>{ROLES.TA}</option>
          <option value={ROLES.PROFESSOR}>{ROLES.PROFESSOR}</option>
          <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
        </select>
      </div>

      <div className="flex flex-column justify-end">
        <div className="p-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href="/profile"
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() =>
              updateProfile(
                newFirstName,
                newMiddleName === "" ? undefined : newMiddleName,
                newLastName,
                newEmail,
                newRole
              )
            }
            href="/profile"
            disabled={!newFirstName || !newLastName || !newEmail}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
