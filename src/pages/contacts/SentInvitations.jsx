import { useEffect, useState } from "react";

export default function SentInvitations() {
  const [sentInvitations, setSentInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchSentInvitations = () => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8080/api/users/invitations/sent", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch sent invitations")
      )
      .then((data) => setSentInvitations(data))
      .catch(() => setError("Failed to load sent invitations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchSentInvitations();
  }, [token]);

  const handleCancelInvitation = async (invitationId) => {
    if (!window.confirm("Are you sure you want to cancel this invitation?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/invitations/${invitationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Cancel failed");
      alert("Invitation cancelled");
      fetchSentInvitations();
    } catch {
      alert("Failed to cancel invitation");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading sent invitations...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (sentInvitations.length === 0)
    return <p className="text-center text-gray-600 mt-10">No sent invitations found.</p>;

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-teal-700 mb-4 flex items-center gap-2">
        Sent Invitations
      </h2>
      <ul className="space-y-3">
        {sentInvitations.map((inv) => (
          <li
            key={inv.id}
            className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded px-4 py-2"
          >
            <span className="text-gray-800 font-medium">
              {inv.email || inv.contactEmail || "Unknown Email"}
            </span>
            <button
              onClick={() => handleCancelInvitation(inv.id)}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
