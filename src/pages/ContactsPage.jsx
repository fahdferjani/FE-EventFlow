import { Outlet } from 'react-router-dom';

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-emerald-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-teal-700 mb-6">👯‍♂️ Friends</h1>
        <Outlet />
      </div>
    </div>
  );
}
