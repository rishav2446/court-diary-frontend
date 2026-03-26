import { useState } from "react";
import { registerUser } from "../services/authservice";
import { useNavigate } from "react-router-dom";

function Register() {
   const navigate = useNavigate();
  // state for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // API call
  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const data = await registerUser(username, password);
      alert("User registered: " + data);

       navigate("/dashboard");

      // clear form
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      {/* Username Input */}
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      {/* Button */}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;