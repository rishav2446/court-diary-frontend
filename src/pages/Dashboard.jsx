import React, { useState } from "react";
import StudentForm from "./StudentForm";

function Dashboard() {
  const [students, setStudents] = useState([]);

  // This is your handleData (real version)
  const handleAddStudent = (name) => {
    console.log("Received from child:", name);

    // update state (real project logic)
    setStudents([...students, name]);
  };

  return (
    <div>
      <h2>Student Dashboard</h2>

      {/* Passing function to child */}
      <StudentForm onAddStudent={handleAddStudent} />

      <h3>Student List:</h3>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{student}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;