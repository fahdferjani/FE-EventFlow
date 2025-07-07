import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://event-flow-six.vercel.app/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setSuccess("Login successful!");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={contentWrapperStyle}>
        <div style={leftStyle}>
          <img src="/eventflow.png" alt="eventflow Logo" style={logoStyle} />
          <h1 style={brandTextStyle}>EventFlow</h1>
          <p style={sloganStyle}>Organize Events. Flow with Ease.</p>
        </div>

        <form onSubmit={handleLogin} style={formStyle}>
          <h2 style={formTitle}> Login</h2>

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

          <button type="submit" style={buttonStyle}>Log in</button>

          <p style={{ marginTop: "1rem", textAlign: "center" }}>
            <Link to="/forgot-password" style={linkStyle}>
              Forgotten password?
            </Link>
          </p>
          <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
            Don’t have an account? <Link to="/register" style={linkStyle}>Register</Link>
          </p>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
        </form>
      </div>

      {/* Bottom Note */}
<div style={bottomNoteStyle}>
  <div style={sectionTitle}>🔐 Demo Login</div>
  <p>
    Email: <code style={codeStyle}>testing00@gmail.com</code><br />
    Password: <code style={codeStyle}>testing</code>
  </p>
  <p style={noteStyle}>
    ⚠️ First-time access may take one to two minutes as the server wakes up.<br />
    If the login seems stuck, wait a moment, refresh, and try again.
  </p>

  <div style={sectionTitle}>📘 API Documentation</div>
  <a
    href="https://event-flow-six.vercel.app/api/swagger-ui/index.html"
    target="_blank"
    rel="noopener noreferrer"
    style={linkStyle}
  >
    Open Swagger UI →
  </a>
</div>

    </div>
  );
}

// 🎨 Styles
const pageWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: "100vh",
  background: "#e6f9f2",
  padding: "2rem",
};

const contentWrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexGrow: 1,
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
  color: "#059669", // Emerald
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
  color: "#0f766e", // Teal
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
  background: "#059669", // Emerald
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const linkStyle = {
  color: "#0f766e", // Teal
  textDecoration: "underline",
};

const bottomNoteStyle = {
  fontSize: "0.9rem",
  background: "#e0f2f1",
  color: "#004d40",
  padding: "1.25rem 1.5rem",
  borderRadius: "12px",
  border: "1px solid #b2dfdb",
  lineHeight: "1.6",
  textAlign: "left",
  maxWidth: "480px",
  marginTop: "2rem",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
};

const sectionTitle = {
  fontWeight: "bold",
  fontSize: "1rem",
  color: "#00695c",
  marginBottom: "0.4rem",
  marginTop: "1rem",
};

const noteStyle = {
  fontStyle: "italic",
  fontSize: "0.85rem",
  color: "#00695c",
  margin: "0.8rem 0",
};

const codeStyle = {
  backgroundColor: "#ffffff",
  padding: "2px 6px",
  borderRadius: "4px",
  fontSize: "0.85rem",
  border: "1px solid #ccc",
};
