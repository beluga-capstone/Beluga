interface StudentFormProps {
  email: string;
  setEmail: (value: string) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  email,
  setEmail,
}) => {
  return (
    <> 
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
