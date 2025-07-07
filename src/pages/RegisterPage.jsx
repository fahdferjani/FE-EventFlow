import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, description }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Registration failed");
      }

      setSuccess("Registration successful! You can now login.");
      setEmail("");
      setPassword("");
      setRepeatPassword("");
      setDescription("");
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

      <form onSubmit={handleRegister} style={formStyle}>
        <h2 style={formTitle}> Register</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Repeat Password"
          required
          style={inputStyle}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Register</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account? <Link to="/login" style={linkStyle}>Login</Link>
        </p>

        {error && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center", marginTop: "1rem" }}>{success}</p>}
      </form>
    </div>
  );
}

// 🧩 Styling (same as LoginPage)
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
