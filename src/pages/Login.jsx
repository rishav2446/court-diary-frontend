import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authservice";


function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const data = await loginUser(username, password);

        if (data.token) {
            dispatch(login(data.token)); // ✅ Redux
            navigate("/dashboard");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "250px",
                    }}
                >
                    <h2 style={{ textAlign: "center" }}>Login</h2>

                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={handleLogin}>Login</button>

                    <button onClick={() => navigate("/register")}>
                        Go to Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;