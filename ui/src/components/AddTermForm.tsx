import React, { useState } from "react";

const AddTermForm: React.FC = () => {
  const [termName, setTermName] = useState("");
  const [message, setMessage] = useState("");

  const handleAddTerm = async () => {
    if (!termName) {
      setMessage("Term name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${process.env.backend}/terms`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: termName }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Term "${termName}" added successfully!`);
        setTermName(""); // Reset form
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding term:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="add-term-form">
      <h2>Add a New Term</h2>
      <input
        type="text"
        value={termName}
        onChange={(e) => setTermName(e.target.value)}
        placeholder="Enter term name (e.g., Spring 2025)"
        className="border p-2 mb-4"
      />
      <button
        onClick={handleAddTerm}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Term
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default AddTermForm;
