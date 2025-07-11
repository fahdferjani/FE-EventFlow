import { useEffect, useState } from "react";

export default function ProfilePage() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({ email: "", description: "" });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("https://be-eventflow.onrender.com/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUser({ email: data.email || "", description: data.description || "" });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://be-eventflow.onrender.com/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          description: user.description,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message || "Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in both password fields.");
      setPasswordLoading(false);
      return;
    }
    if (currentPassword !== newPassword) {
      setPasswordError("Passwords do not match.");
    }
    if (currentPassword.length < 6) {
      setPasswordError("Passwords is too short.");
    }
    try {
      // Adjust endpoint & request body according to your backend API
      const res = await fetch("https://be-eventflow.onrender.com/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Password change failed");
      }

      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const res = await fetch("https://be-eventflow.onrender.com/api/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete account");
      }
      alert("Account deleted. You will be logged out.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setDeleteError(err.message || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
  <div className="min-h-screen bg-teal-50 py-12">
  <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-teal-700">Profile Settings</h1>

    {/* Profile Info */}
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      <div>
        <label htmlFor="email" className="block font-semibold mb-1">Email:</label>
        <input
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full p-2 border border-emerald-300 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold mb-1">Description:</label>
        <textarea
          id="description"
          value={user.description}
          onChange={(e) => setUser({ ...user, description: e.target.value })}
          rows={3}
          className="w-full p-2 border border-emerald-300 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
      >
        Save Changes
      </button>
      {success && <p className="text-green-600 mt-2">{success}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>

    <hr className="my-8" />

    {/* Password Change */}
    <h2 className="text-xl font-semibold mb-4 text-teal-700">Change Password</h2>
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
      <div>
        <label htmlFor="currentPassword" className="block font-semibold mb-1">New Password:</label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border border-emerald-300 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block font-semibold mb-1">Repeat New Password:</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border border-emerald-300 rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={passwordLoading}
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
      >
        {passwordLoading ? "Changing..." : "Change Password"}
      </button>
      {passwordSuccess && <p className="text-green-600 mt-2">{passwordSuccess}</p>}
      {passwordError && <p className="text-red-600 mt-2">{passwordError}</p>}
    </form>

    <hr className="my-8" />

    {/* Delete Account */}
    <div className="max-w-sm">
      <button
        onClick={handleDeleteAccount}
        disabled={deleteLoading}
        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        {deleteLoading ? "Deleting..." : "Delete Account"}
      </button>
      {deleteError && <p className="text-red-600 mt-2">{deleteError}</p>}
    </div>
  </div>
</div>

  );
}
