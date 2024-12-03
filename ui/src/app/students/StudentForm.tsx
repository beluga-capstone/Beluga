interface StudentFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
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
    </>
  );
};

export default StudentForm;
