import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventInvitationsPage() {
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    fetch("https://be-eventflow.onrender.com/api/invitations/my-pending-invitations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load invitations")))
      .then((data) => setPendingInvitations(data))
      .catch(() => setError("Could not load invitations"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAction = (eventId, action) => {
    fetch(`https://be-eventflow.onrender.com/api/invitations/invitation/${eventId}/${action}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Action failed");
        setPendingInvitations((prev) => prev.filter((inv) => inv.event.id !== eventId));
        if (action === "accept") setSuccessMessage("Invitation accepted successfully!");
        if (action === "decline") setSuccessMessage("Invitation declined successfully!");
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#e6fffa" }}>
      <h1 className="text-2xl font-bold mb-6 text-teal-800">📨 Pending Event Invitations</h1>

      {successMessage && (
        <div className="text-emerald-600 mb-4 font-medium">{successMessage}</div>
      )}

      {pendingInvitations.length === 0 ? (
        <p className="text-teal-600">You have no pending invitations.</p>
      ) : (
        <ul className="space-y-4">
          {pendingInvitations.map((inv) => (
            <li
              key={inv.event.id}
              className="border border-teal-200 p-4 rounded-xl shadow bg-teal-50 hover:bg-teal-100 transition"
            >
              <h2 className="font-bold text-lg text-teal-800 mb-1">{inv.event.description}</h2>
              <p className="text-teal-700 mb-3">From: <span className="font-medium">{inv.ownerEmail}</span></p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAction(inv.event.id, "accept")}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(inv.event.id, "decline")}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
