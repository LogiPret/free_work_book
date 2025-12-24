'use client';

import { useState, useEffect } from 'react';
import { Broker } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      setAuthError('');
      fetchBrokers();
    } else {
      setAuthError('Invalid password');
    }
  };

  const fetchBrokers = async () => {
    try {
      const res = await fetch('/api/brokers');
      const data = await res.json();
      setBrokers(data);
    } catch (error) {
      console.error('Error fetching brokers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if already authenticated (session)
    const checkAuth = async () => {
      const res = await fetch('/api/auth');
      if (res.ok) {
        setIsAuthenticated(true);
        fetchBrokers();
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broker?')) return;

    const res = await fetch(`/api/brokers/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setBrokers(brokers.filter((b) => b.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Broker Admin</h1>
          <Link
            href="/admin/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Add Broker
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : brokers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No brokers yet</p>
            <Link href="/admin/new" className="text-blue-600 font-semibold hover:underline">
              Add your first broker
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Name</th>
                  <th className="text-left px-6 py-4 font-semibold">Company</th>
                  <th className="text-left px-6 py-4 font-semibold">Slug</th>
                  <th className="text-left px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker) => (
                  <tr key={broker.id} className="border-t">
                    <td className="px-6 py-4">{broker.name}</td>
                    <td className="px-6 py-4">{broker.company}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/broker/${broker.slug}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                      >
                        /broker/{broker.slug}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/edit/${broker.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(broker.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
