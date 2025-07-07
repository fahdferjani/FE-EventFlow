import { useEffect, useState } from "react";

export default function ReceivedInvitations() {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchReceivedInvitations = () => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8080/api/users/invitations/received", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch received invitations")))
      .then((data) => setReceivedInvitations(data))
      .catch(() => setError("Failed to load received invitations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchReceivedInvitations();
  }, [token]);

  const handleRespond = async (invitationId, accept) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/invitations/${invitationId}?accept=${accept}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Response failed");
      alert(`Invitation ${accept ? "accepted" : "declined"}`);
      fetchReceivedInvitations();
    } catch {
      alert("Failed to respond to invitation");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading received invitations...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (receivedInvitations.length === 0)
    return <p className="text-center mt-10 text-gray-600">No received invitations found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-teal-700 mb-4 flex items-center gap-2">
        Received Invitations
      </h2>

      <ul className="space-y-3">
        {receivedInvitations.map((inv) => (
          <li
            key={inv.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border border-emerald-200 bg-emerald-50 rounded px-4 py-3"
          >
            <div className="mb-2 md:mb-0">
              <p className="text-gray-800 font-medium">{inv.email || inv.contactEmail || "Unknown Email"}</p>
              {inv.description && (
                <p className="text-gray-600 text-sm">{inv.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleRespond(inv.id, true)}
                className="bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleRespond(inv.id, false)}
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 transition"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
