import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authservice";
import { useToast } from "../hooks/useToast";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import Card from "../Components/ui/Card";
import { FiUser, FiLock, FiAward, FiShield } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required";
    if (password.length < 6) errors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!barNumber.trim()) errors.barNumber = "Bar Council Number is required";
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerUser(username, password);
      toast.success("Registration successful! Please login.");
      setTimeout(() => navigate("/"), 1200);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setBarNumber("");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed. Try a different username.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="animate-fade-in-up" style={{ background: 'transparent', border: 'none' }} padding="none">
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <h2 className="display-font" style={{ fontSize: "var(--text-3xl)", color: "var(--color-text-primary)", fontWeight: 700 }}>
            Establish Practice
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginTop: "var(--space-1)" }}>
            Register to set up your digital court ledger
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Input
            label="Username"
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
            label="Bar Council Registration Number"
            type="text"
            icon={FiAward}
            value={barNumber}
            onChange={(e) => {
              setBarNumber(e.target.value);
              if (validationError.barNumber) setValidationError(prev => ({ ...prev, barNumber: null }));
            }}
            error={validationError.barNumber}
            required
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
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={FiShield}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationError.confirmPassword) setValidationError(prev => ({ ...prev, confirmPassword: null }));
            }}
            error={validationError.confirmPassword}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            fullWidth
            style={{ marginTop: "var(--space-2)" }}
          >
            Create Practice
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            fullWidth
          >
            Already registered? Sign In
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default Register;