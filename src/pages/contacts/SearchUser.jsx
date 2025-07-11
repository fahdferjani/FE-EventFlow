import { useState } from 'react';

export default function SearchUser() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');

  const token = localStorage.getItem('token');

  const handleSearch = async () => {
    setResult(null);
    setError('');
    setSendSuccess('');
    setSendError('');
    try {
      const response = await fetch(
        `https://be-eventflow.onrender.com/api/users/search?email=${encodeURIComponent(email)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        setError('User not found');
        return;
      }
      const data = await response.json();
      setResult(data);
    } catch {
      setError('Error searching for user');
    }
  };

  const handleSendRequest = async () => {
    if (!result || !result.id) return;
    setSending(true);
    setSendSuccess('');
    setSendError('');
    try {
      const response = await fetch(
        `https://be-eventflow.onrender.com/api/users/invitations?contactId=${result.id}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send request');
      }
      setSendSuccess('Friend request sent!');
    } catch (err) {
      setSendError(err.message || 'Failed to send request');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="flex items-center gap-3 mb-4">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {result && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded shadow flex justify-between items-start">
          <div className="text-sm leading-relaxed">
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>Description:</strong> {result.description || '-'}</p>
          </div>
          <div>
            <button
              onClick={handleSendRequest}
              disabled={sending}
              className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
            >
              {sending ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      )}

      {sendSuccess && <p className="mt-4 text-emerald-600">{sendSuccess}</p>}
      {sendError && <p className="mt-4 text-red-600">{sendError}</p>}
    </div>
  );
}
