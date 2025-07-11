import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function NewEventPage() {
  const [description, setDescription] = useState("");
  const [importanceLevel, setimportanceLevel] = useState(1);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [order, setOrder] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const query = useQuery();

  const parentEventId = query.get("parentEventId");
  const isSubEvent = !!parentEventId;
  const orderLabel = isSubEvent ? "Sub Order *" : "Order *";

  const validateForm = () => {
    if (!description.trim()) return setError("Description is required"), false;
    if (!location.trim()) return setError("Location is required"), false;
    if (!type.trim()) return setError("Type is required"), false;
    if (!startDate) return setError("Start date is required"), false;
    if (!dueDate) return setError("Due date is required"), false;
    if (!order || order < 1) return setError(`${orderLabel} must be 1 or greater`), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const params = new URLSearchParams({
        description: description.trim(),
        importanceLevel: importanceLevel.toString(),
        location: location.trim(),
        type: type.trim(),
        startDate,
        dueDate,
        ...(isSubEvent ? { subOrder: order.toString() } : { order: order.toString() })
      });

      const url = isSubEvent
        ? `https://be-eventflow.onrender.com/api/events/${parentEventId}/sub-events?${params.toString()}`
        : `https://be-eventflow.onrender.com/api/events/?${params.toString()}`;

      const res = await fetch(url, {
        method: "POST",
        headers
      });

      if (!res.ok) throw new Error(await res.text() || "Failed to create event");

      setSuccess(isSubEvent ? "Event item created successfully!" : "Event created successfully!");
      if (!isSubEvent) {
        setDescription(""); setimportanceLevel(1); setLocation("");
      setType(""); setStartDate(""); setDueDate(""); setOrder(1);
      }

      setTimeout(() => navigate(isSubEvent ? `/events/${parentEventId}` : "/home"), 1500);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-12">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-teal-800">
          {isSubEvent ? "➕ Create New Event Item" : " Create New Event"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold block mb-1">Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Importance Level (1–5) *</label>
            <input
              type="number"
              min="1"
              max="5"
              value={importanceLevel}
              onChange={(e) => setimportanceLevel(Number(e.target.value))}
              className="w-24 border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Type *</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Start Date *</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Due Date *</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">{orderLabel}</label>
            <input
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-24 border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            {submitting
              ? isSubEvent
                ? "Creating event item..."
                : "Creating..."
              : isSubEvent
              ? "Create event item"
              : "Create event"}
          </button>
        </form>
      </div>
    </div>
  );
}
