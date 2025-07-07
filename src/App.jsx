import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import EventDetailsPage from './pages/EventDetailsPage';
import InvitedEventPage from "./pages/InvitedEventPage";
import ContactsPage from './pages/ContactsPage';
import SearchUser from './pages/contacts/SearchUser';
import ContactsList from './pages/contacts/ContactsList';
import SentInvitations from './pages/contacts/SentInvitations';
import ReceivedInvitations from './pages/contacts/ReceivedInvitations';
import NewEventPage from './pages/NewEventPage';
import ProfilePage from './pages/ProfilePage';
import EventInvitationsPage from './pages/EventInvitationsPage';

function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const hideNavbarOnPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const shouldHideNavbar = hideNavbarOnPaths.includes(location.pathname);

  return (
    <div>
      {token && !shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} />} />
        <Route path="/login" element={token ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/home" /> : <RegisterPage />} />
        <Route path="/forgot-password" element={token ? <Navigate to="/home" /> : <ForgotPasswordPage />} />
        <Route path="/reset-password" element={token ? <Navigate to="/home" /> : <ResetPasswordPage />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="/invited-events/:eventId" element={<InvitedEventPage />} />
        <Route path="/invited-events/:eventId" element={<EventDetailsPage isInvited={true} />} />
        <Route path="/contacts" element={<ContactsPage />}>
          <Route path="search" element={<SearchUser />} />
          <Route path="list" element={<ContactsList />} />
          <Route path="sent" element={<SentInvitations />} />
          <Route path="received" element={<ReceivedInvitations />} />
          <Route index element={<Navigate to="search" replace />} />
        </Route>
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <NewEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-invitations"
          element={
           <ProtectedRoute>
              <EventInvitationsPage />
           </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />{}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
