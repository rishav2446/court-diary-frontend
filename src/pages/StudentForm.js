import React, { useState } from "react";

function StudentForm({ onAddStudent }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name) return;

    // Sending data to parent
    onAddStudent(name);

    // clear input
    setName("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter student name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Student</button>
    </div>
  );
}

export default StudentForm;