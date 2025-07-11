import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Token is missing from the URL.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const response = await fetch("https://be-eventflow.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) throw new Error("Password reset failed");

      setMessage("✅ Password has been reset successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={leftStyle}>
        <img src="/eventflow.png" alt="eventflow Logo" style={logoStyle} />
        <h1 style={brandTextStyle}>EventFlow</h1>
        <p style={sloganStyle}>Organize Events. Flow with Ease.</p>
      </div>

      <form onSubmit={handleReset} style={formStyle}>
        <h2 style={formTitle}>🔒 Reset Password</h2>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Reset Password</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/login" style={linkStyle}>Back to Login</Link>
        </p>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
    </div>
  );
}

// Styling (invited users Login/Register pages)
const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#e6f9f2",
  padding: "2rem",
};

const leftStyle = {
  marginRight: "4rem",
  textAlign: "right",
};

const logoStyle = {
  width: "80px",
  height: "80px",
  marginBottom: "0.5rem",
};

const brandTextStyle = {
  fontSize: "2.5rem",
  color: "#059669",
  margin: 0,
  fontWeight: "bold",
};

const sloganStyle = {
  fontSize: "1.1rem",
  color: "#333",
  maxWidth: "250px",
  marginTop: "0.5rem",
};

const formStyle = {
  background: "white",
  padding: "2rem",
  borderRadius: "10px",
  width: "320px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
};

const formTitle = {
  color: "#0f766e",
  textAlign: "center",
  fontSize: "1.5rem",
  marginBottom: "1.5rem",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  marginBottom: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  background: "#059669",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const linkStyle = {
  color: "#0f766e",
  textDecoration: "none",
};
