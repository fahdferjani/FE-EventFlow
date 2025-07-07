import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`https://event-flow-six.vercel.app/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }

      setMessage("✅ Password reset link sent. Please check your email.");
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

      <form onSubmit={handleForgotPassword} style={formStyle}>
        <h2 style={formTitle}>🔐 Forgot Password</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Send Reset Link</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/login" style={linkStyle}>Back to Login</Link>
        </p>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
    </div>
  );
}

// Invited styles
const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#eaf4fb",
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
  color: "#007bff",
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
  color: "#007bff",
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
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
};
