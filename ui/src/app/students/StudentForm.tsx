import { ROLES } from "@/constants";

interface StudentFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  middleName: string;
  setMiddleName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  email,
  setEmail,
  role,
  setRole,
}) => {
  return (
    <>
      <div className="flex space-x-4">
        <div className="pr-8">
          <h2>First Name</h2>
          <div className="pt-2 pb-8">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded p-1 bg-surface"
        >
          <option value={ROLES[3]}>{ROLES[3]}</option>
          <option value={ROLES[2]}>{ROLES[2]}</option>
        </select>
      </div>
    </>
  );
};

export default StudentForm;
