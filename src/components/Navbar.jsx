import { Link, NavLink } from "react-router-dom";
import { useState, useRef } from "react";

export default function Navbar() {
  const [contactsOpen, setContactsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setContactsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setContactsOpen(false), 200);
  };

  return (
    <nav className="bg-teal-600 text-white px-6 py-3 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo & Name */}
        <NavLink to="/home" className="flex items-center space-x-2">
          <img
            src="/eventflow.png"
            alt="eventflow Logo"
            className="w-8 h-8 rounded-md shadow-sm"
          />
          <span className="text-xl font-bold tracking-wide hover:underline">
            EventFlow
          </span>
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          <NavLink to="/home" className="hover:underline">
            Home
          </NavLink>
          <NavLink to="/event-invitations" className="hover:underline">
            Event Invitations
          </NavLink>

          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="hover:underline focus:outline-none">
              Friends
            </button>
            {contactsOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded shadow-md z-50">
                <Link
                  to="/contacts/search"
                  className="block px-4 py-2 hover:bg-emerald-100"
                  onClick={() => setContactsOpen(false)}
                >
                  Search User
                </Link>
                <Link
                  to="/contacts/list"
                  className="block px-4 py-2 hover:bg-emerald-100"
                  onClick={() => setContactsOpen(false)}
                >
                  My Friends
                </Link>
                <Link
                  to="/contacts/sent"
                  className="block px-4 py-2 hover:bg-emerald-100"
                  onClick={() => setContactsOpen(false)}
                >
                  Sent Invitations
                </Link>
                <Link
                  to="/contacts/received"
                  className="block px-4 py-2 hover:bg-emerald-100"
                  onClick={() => setContactsOpen(false)}
                >
                  Received Invitations
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/events/new" className="hover:underline">
            Create Event
          </NavLink>
          <NavLink to="/profile" className="hover:underline">
            Profile
          </NavLink>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
