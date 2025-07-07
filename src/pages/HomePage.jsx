import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [invitedEvents, setInvitedEvents] = useState([]);
  const [eventItems, setEventItems] = useState({});
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    const eventsUrl = showOpenOnly
      ? "http://localhost:8080/api/events/?filter=true"
      : "http://localhost:8080/api/events/";

    fetch(eventsUrl, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch events")))
      .then(setEvents)
      .catch(() => setEvents([]));

    fetch("http://localhost:8080/api/invitations/my-invited-events", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch invited events")))
      .then(setInvitedEvents)
      .catch(() => setInvitedEvents([]));
  }, [showOpenOnly]);

  const handleEventClick = (eventId, isInvited) => {
    navigate(isInvited ? `/invited-events/${eventId}` : `/events/${eventId}`);
  };

  const toggleSubs = (eventId, isInvited) => {
    eventItems[eventId]
      ? setEventItems((prev) => ({ ...prev, [eventId]: null }))
      : fetchSubs(eventId, isInvited);
  };

  const fetchSubs = (eventId, isInvited) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    if (isInvited) {
      const invitedEvent = invitedEvents.find((sg) => sg.event.id === eventId);
      if (!invitedEvent) return setEventItems((prev) => ({ ...prev, [eventId]: [] }));
      const contactId = invitedEvent.ownerID;

      fetch(`http://localhost:8080/api/invitations/invited-events/${eventId}/sub-events?contactId=${contactId}`, { headers })
        .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch sub events")))
        .then((data) => setEventItems((prev) => ({ ...prev, [eventId]: data })))
        .catch(() => setEventItems((prev) => ({ ...prev, [eventId]: [] })));
    } else {
      fetch(`http://localhost:8080/api/events/${eventId}/sub-events`, { headers })
        .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch sub events")))
        .then((data) => setEventItems((prev) => ({ ...prev, [eventId]: data })))
        .catch(() => setEventItems((prev) => ({ ...prev, [eventId]: [] })));
    }
  };

  const handleSubclick = (parentId, subId, isInvited) => {
    navigate(isInvited ? `/invited-events/${subId}` : `/events/${subId}`);
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#e6fffa" }}>
      {/* Welcome message */}
       <div className="text-center mb-10">
       <h2 className="text-3xl font-bold text-emerald-700">👋 Welcome to EventFlow!</h2>
       </div>
      {/* My events */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-teal-900">🎉 My Events</h2>
          <label className="text-sm text-teal-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={() => setShowOpenOnly((prev) => !prev)}
              className="mr-2"
            />
            Show only ongoing events
          </label>
        </div>

        {events.length === 0 ? (
          <p className="text-teal-500">No events yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => {
              const importanceLevel = Math.max(0, Math.min(event.importanceLevel || 0, 5));
              const subsVisible = !!eventItems[event.id];
              return (
                <div
                  key={event.id}
                  className="cursor-pointer bg-teal-50 border border-teal-200 p-4 rounded-xl shadow hover:shadow-lg hover:bg-teal-100 transition"
                  onClick={() => handleEventClick(event.id, false)}
                >
                  <h3 className="font-bold text-lg text-teal-800 mb-1">{event.description}</h3>
                  <p className="text-sm text-teal-700">📅 {event.startDate} → {event.dueDate}</p>
                  <p className="text-sm text-teal-700">📍 Location: {event.location}</p> 
                  <p className="text-sm text-teal-700">📌 Type: {event.type}</p> 
                  <p className="text-sm text-teal-700 mt-1">
                    ⏰ importanceLevel: {"★".repeat(importanceLevel)}{"☆".repeat(5 - importanceLevel)}
                  </p>

                  <button
                    className="text-teal-600 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubs(event.id, false);
                    }}
                  >
                    {subsVisible ? "- Hide Sub Events" : "+ Show Sub Events"}
                  </button>

                  {subsVisible && eventItems[event.id] && (
                    <ul className="list-disc pl-5 mt-3 text-sm">
                      {eventItems[event.id].map((sub) => (
                        <li
                          key={sub.itemAgendaId}
                          className="text-teal-600 hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubclick(event.id, sub.itemAgendaId, false);
                          }}
                        >
                          {sub.description}  {sub.done ? "✅" : "❌"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invited Events */}
      <div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">🎟️ Invited Events</h2>
        {invitedEvents.length === 0 ? (
          <p className="text-emerald-500">No invited events.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {invitedEvents.map(({ event, ownerEmail }) => {
              const importanceLevel = Math.max(0, Math.min(event.importanceLevel || 0, 5));
              const subsVisible = !!eventItems[event.id];
              return (
                <div
                  key={event.id}
                  className="cursor-pointer bg-teal-50 border border-teal-200 p-4 rounded-xl shadow hover:shadow-lg hover:bg-teal-100 transition"
                  onClick={() => handleEventClick(event.id, true)}
                >
                  <h3 className="font-bold text-lg text-blue-800 mb-1">{event.description}</h3>
                  <p className="text-sm text-emerald-700">📅 {event.startDate} → {event.dueDate}</p> 
                  <p className="text-sm text-emerald-700">📍 Location: {event.location}</p> 
                  <p className="text-sm text-emerald-700">📌 Type: {event.type}</p>               
                  <p className="text-sm text-emerald-700">⏰ importanceLevel: {"★".repeat(importanceLevel)}{"☆".repeat(5 - importanceLevel)}</p>
                  <p className="text-sm text-emerald-700 mt-1">🎫 Invited by: <span className="font-medium">{ownerEmail}</span></p>

                  <button
                    className="text-emerald-600 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubs(event.id, true);
                    }}
                  >
                    {subsVisible ? "- Hide Sub Events" : "+ Show Sub Events"}
                  </button>

                  {subsVisible && eventItems[event.id] && (
                    <ul className="list-disc pl-5 mt-3 text-sm">
                      {eventItems[event.id].map((sub) => (
                        <li
                          key={sub.itemAgendaId}
                          className="text-emerald-600 hover:underline cursor-pointer"
                        >
                          {sub.description} {sub.done ? "✅" : "❌"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
