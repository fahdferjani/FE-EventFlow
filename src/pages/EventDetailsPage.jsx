import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [invitingUsers, setInvitingUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [invitingLoading, setInvitingLoading] = useState(false);
  const [invitingError, setInvitingError] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    // Load event
    fetch(`http://localhost:8080/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load event")))
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load event data.");
        setLoading(false);
      });
  }, [eventId, token]);

  useEffect(() => {
    if (!token || !event || event.hierarchy !== 1) return;

    // Load invited users for this event
    fetch(`http://localhost:8080/api/invitations/invited/${eventId}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load invited users")))
      .then((data) => setInvitingUsers(data))
      .catch(() => setInvitingUsers([]));

    // Load comments for this event
    fetch(`http://localhost:8080/api/invitations/comments/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load comments")))
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [eventId, event, token]);

  const handleSave = async () => {
    if (!event) return;
    setUpdating(true);
    try {
      await fetch(`http://localhost:8080/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: event.description,
          importanceLevel: event.importanceLevel,
          location: event.location,
          type: event.type,
          startDate: event.startDate,
          dueDate: event.dueDate,
          isDone: event.done,
          eventOrder: event.order,
        }),
      });

      alert("event updated successfully!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
    return;
  }

  const isMain = event?.hierarchy === 1;
  const endpoint = isMain
    ? `http://localhost:8080/api/events/${eventId}`
    : `http://localhost:8080/api/events/sub-events/${eventId}`;

  try {
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Delete failed");

    alert(`${isMain ? "Main event" : "Sub event"} deleted successfully!`);
    navigate("/home");
  } catch (err) {
    alert("Failed to delete event.");
  }
};


  const handleInvite = async () => {
    setInvitingError("");
    if (!selectedContactId) {
      setInvitingError("Please select a contact to invite.");
      return;
    }
    setInvitingLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/invitations/invite?eventId=${eventId}&contactId=${selectedContactId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to invite to this event.");
      }
      alert("Invitation sent! The user must accept it in Event Invitations page.");
      setSelectedContactId("");
    } catch (err) {
      setInvitingError(err.message);
    } finally {
      setInvitingLoading(false);
    }
  };
  const handleUninvite = async (contactId) => {
    if (!window.confirm("Are you sure you want to uninvite this user to this event?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/invitations/invite/${eventId}/${contactId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to uninvite");

      // Refresh invited users list
      const updated = await fetch(`http://localhost:8080/api/invitations/invited/${eventId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (updated.ok) {
        const data = await updated.json();
        setInvitingUsers(data);
      }
    } catch (err) {
      alert(err.message || "Something went wrong while uninviting.");
    }
  };

  // Add a comment
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/invitations/comment?eventId=${eventId}&text=${encodeURIComponent(commentText)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");

      setCommentText("");
      // Refresh comments list
      const refreshedComments = await fetch(`http://localhost:8080/api/invitations/comments/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshedComments.ok) {
        const commentsData = await refreshedComments.json();
        setComments(commentsData);
      }
    } catch (err) {
      alert(err.message || "Failed to add comment.");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/invitations/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      // Refresh comments list
      const refreshedComments = await fetch(`http://localhost:8080/api/invitations/comments/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshedComments.ok) {
        const commentsData = await refreshedComments.json();
        setComments(commentsData);
      }
    } catch (err) {
      alert(err.message || "Failed to delete comment.");
    }
  };

  useEffect(() => {
    if (!token || !event || event.hierarchy !== 1) return;

    fetch("http://localhost:8080/api/users/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load contacts")))
      .then((data) => setContacts(data))
      .catch(() => setContacts([]));
  }, [token, event]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!event) return null;

  return (
  <div className="min-h-screen bg-teal-50 py-10 px-4">
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-teal-800 mb-6 flex items-center gap-2">
         {event.description}
      </h1>

      {/* Editable fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-emerald-800 mb-1">Description:</label>
          <input
            type="text"
            className="w-full border border-emerald-300 p-2 rounded"
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold text-emerald-800 mb-1">importanceLevel (1–5):</label>
          <input
            type="number"
            min="1"
            max="5"
            className="w-full border border-emerald-300 p-2 rounded"
            value={event.importanceLevel}
            onChange={(e) =>
              setEvent({ ...event, importanceLevel: Math.max(1, Math.min(5, parseInt(e.target.value) || 1)) })
            }
          />
        </div>

        <div>
          <label className="block font-semibold text-emerald-800 mb-1">Location:</label>
          <input
            type="text"
            className="w-full border border-emerald-300 p-2 rounded"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold text-emerald-800 mb-1">Type:</label>
          <input
            type="text"
            className="w-full border border-emerald-300 p-2 rounded"
            value={event.type}
            onChange={(e) => setEvent({ ...event, type: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold text-emerald-800 mb-1">event Order:</label>
          <input
            type="number"
            className="w-full border border-emerald-300 p-2 rounded"
            value={event.order || 0}
            onChange={(e) => setEvent({ ...event, order: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <label className="block font-semibold text-emerald-800 mb-1">Start Date:</label>
          <input
            type="datetime-local"
            className="w-full border border-emerald-300 p-2 rounded"
            value={event.startDate}
            onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold text-emerald-800 mb-1">Due Date:</label>
          <input
            type="datetime-local"
            className="w-full border border-emerald-300 p-2 rounded"
            value={event.dueDate}
            onChange={(e) => setEvent({ ...event, dueDate: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <label className="font-semibold text-emerald-800">✅ Done:</label>
          <input
            type="checkbox"
            checked={event.done}
            onChange={(e) => setEvent({ ...event, done: e.target.checked })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={updating}
          className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          {updating ? "Saving..." : "💾 Save Changes"}
        </button>

        {event.hierarchy === 1 && (
          <button
            onClick={() => navigate(`/events/new?parentEventId=${eventId}`)}
            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            ➕ Add Sub Event
          </button>
        )}

        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          🗑️ Delete event
        </button>
      </div>

      {/* Comments */}
      {event.hierarchy === 1 && (
        <div className="mt-10 p-5 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">💬 Comments</h2>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full border border-emerald-300 p-2 rounded mb-3"
            placeholder="Write your comment..."
          />

          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Add Comment
          </button>

          {comments.length === 0 ? (
            <p className="text-emerald-600 mt-4">No comments yet.</p>
          ) : (
            <ul className="space-y-2 mt-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="flex justify-between items-center border border-emerald-200 rounded px-3 py-2 bg-white"
                >
                  <div>
                    <p className="font-medium">{comment.userEmail}</p>
                    <p className="text-emerald-700">{comment.text}</p>
                    <p className="text-gray-400 text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Inviting */}
      {event.hierarchy === 1 && (
        <div className="mt-10 p-5 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">📨 Inviting</h2>

          <div className="flex space-x-2 mb-4">
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="flex-grow border border-emerald-300 rounded px-3 py-2"
            >
              <option value="">-- Select a friend --</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.email}
                </option>
              ))}
            </select>
            <button
              onClick={handleInvite}
              disabled={invitingLoading}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
              {invitingLoading ? "Inviting..." : "Invite"}
            </button>
          </div>

          {invitingError && <p className="text-red-600 mb-2">{invitingError}</p>}

          <h3 className="font-semibold text-emerald-800 mb-2">Invited Users:</h3>
          {invitingUsers.length === 0 ? (
            <p className="text-emerald-600">No users have access to this event.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {invitingUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center border border-emerald-200 rounded px-3 py-2 bg-white"
                >
                  <span>{user.email}</span>
                  <button
                    onClick={() => handleUninvite(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    Uninvite
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </div>

  );
}
