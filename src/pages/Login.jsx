import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import Card from "../Components/ui/Card";
import { FiUser, FiLock } from "react-icons/fi";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState({});
  const [remember, setRemember] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await login(username, password);

    if (res.success) {
      toast.success("Welcome back! Redirecting to Dashboard...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast.error(res.error || "Invalid username or password");
    }
  };

  return (
    <AuthLayout>
      <Card className="login-card animate-fade-in-up" padding="md" variant="elevated">
        <div className="login-card__head">
          <div className="login-logo">🏛️</div>
          <h2 className="login-title">Sign in to Court Diary</h2>
          <p className="login-sub">Enter your credentials to access your practice workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <Input
            label="Username or Email"
            type="text"
            icon={FiUser}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (validationError.username) setValidationError(prev => ({ ...prev, username: null }));
            }}
            error={validationError.username}
            required
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            icon={FiLock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationError.password) setValidationError(prev => ({ ...prev, password: null }));
            }}
            error={validationError.password}
            required
            autoComplete="current-password"
          />

          <div className="login-actions">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-label="Remember me"
              />
              <span>Remember me</span>
            </label>

            <button type="button" className="login-forgot" onClick={() => navigate('/forgot-password')}>
              Forgot?
            </button>
          </div>

          <Button type="submit" variant="primary" loading={isLoading} fullWidth>
            Sign in
          </Button>

          <div className="login-divider">Don't have an account? <button type="button" className="link" onClick={() => navigate('/register')}>Create one</button></div>
        </form>

      </Card>
    </AuthLayout>
  );
}

export default Login;