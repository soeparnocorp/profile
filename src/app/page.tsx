// src/app/join/page.tsx
"use client"; // Client component untuk interactivity

import { useState } from 'react';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setSuccess(true);
        setMessage('Terima kasih! Kamu udah join inner circle READTalk.');
      } else {
        setMessage('Gagal submit, coba lagi ya.');
      }
    } catch (err) {
      setMessage('Error koneksi, cek internet loe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-950 text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Inner Circle</h1>
        <p className="text-xl mb-10 opacity-90">
          Dapatkan update eksklusif, early access, dan newsletter dari @SoeparnoCorp – Soeparno Enterprise.
        </p>

        {success ? (
          <div className="bg-green-900/50 p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Sukses!</h2>
            <p>{message}</p>
            <a href="/" className="mt-6 inline-block text-indigo-400 hover:underline">
              Kembali ke home
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Nama loe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="Email loe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-xl text-xl font-bold transition disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim & Join'}
            </button>
          </form>
        )}

        <p className="mt-8 text-sm opacity-70">
          Privasi aman. No spam, only value dari READTalk Messenger.
        </p>
      </div>
    </main>
  );
}
