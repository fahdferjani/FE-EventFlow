import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function InvitedEventPage() {
  const { eventId } = useParams();
  const [eventData, seteventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("https://event-flow-six.vercel.app/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to get current user"))
      .then((data) => setCurrentUserEmail(data.email))
      .catch(() => setCurrentUserEmail(""));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch(`https://event-flow-six.vercel.app/api/invitations/my-invited-events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to load invited event"))
      .then((data) => {
        seteventData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load invited event data.");
        setLoading(false);
      });
  }, [eventId, token]);

  useEffect(() => {
    if (!token) return;

    fetch(`https://event-flow-six.vercel.app/api/invitations/comments/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to load comments"))
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [eventId, token]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const res = await fetch(
        `https://event-flow-six.vercel.app/api/invitations/comment?eventId=${eventId}&text=${encodeURIComponent(commentText)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");

      setCommentText("");
      const refreshedComments = await fetch(`https://event-flow-six.vercel.app/api/invitations/comments/${eventId}`, {
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

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`https://event-flow-six.vercel.app/api/invitations/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      const refreshedComments = await fetch(`https://event-flow-six.vercel.app/api/invitations/comments/${eventId}`, {
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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!eventData) return null;

  const { event, ownerEmail } = eventData;

  return (
    <div className="min-h-screen bg-emerald-50 py-10 px-4">
  <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold text-teal-700 mb-6 flex items-center gap-2">
       {event.description}
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <p><strong>🔗 Invited by:</strong> {ownerEmail}</p>
      <p><strong>📅 Start:</strong> {event.startDate}</p>
      <p><strong>📅 Due:</strong> {event.dueDate}</p>
      <p><strong>📍 Location:</strong> {event.location}</p>
      <p><strong>📌 Type:</strong> {event.type}</p>
      <p><strong>⏰ importanceLevel:</strong> {"★".repeat(event.importanceLevel)}{"☆".repeat(5 - event.importanceLevel)}</p>
      <p><strong>✅ Done:</strong> {event.done ? "Yes" : "No"}</p>
    </div>

    {event.hierarchy === 1 && (
      <div className="mt-10 p-5 bg-emerald-100 border border-emerald-300 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-teal-700 mb-4">💬 Comments</h2>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-3"
          placeholder="Write your comment..."
        />

        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Add Comment
        </button>

        {comments.length === 0 ? (
          <p className="text-gray-600 mt-4">No comments yet.</p>
        ) : (
          <ul className="space-y-2 mt-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="flex justify-between items-center border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <div>
                  <p className="font-medium">{comment.userEmail}</p>
                  <p className="text-gray-600">{comment.text}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                {comment.userEmail.toLowerCase() === currentUserEmail.toLowerCase() && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
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
