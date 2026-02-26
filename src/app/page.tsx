// src/app/page.tsx
"use client";

import { useState } from 'react';

export default function CreateProfile() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([{ label: '', url: '' }]);
  const [status, setStatus] = useState('');

  const addLink = () => setLinks([...links, { label: '', url: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');

    if (!cleanUsername || !name) {
      setStatus('Username dan nama wajib diisi!');
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          name,
          bio,
          links,
        }),
      });

      if (res.ok) {
        setStatus(`Sukses! Profile @${cleanUsername} dibuat. Buka: https://readtalk.pages.dev/@${cleanUsername}`);
      } else {
        setStatus('Gagal menyimpan profile.');
      }
    } catch {
      setStatus('Error koneksi.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <h1 className="text-5xl font-bold mb-8 text-center">Buat Profile Linktree</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@username (tanpa spasi)"
            required
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama tampilan"
            required
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio singkat (opsional)"
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl h-32"
          />

          {/* Links dinamis */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Links Sosmed / Website</h3>
            {links.map((link, index) => (
              <div key={index} className="flex gap-4">
                <input
                  value={link.label}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[index].label = e.target.value;
                    setLinks(newLinks);
                  }}
                  placeholder="Label (misal: X / Twitter)"
                  className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-xl"
                />
                <input
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[index].url = e.target.value;
                    setLinks(newLinks);
                  }}
                  placeholder="URL"
                  className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-xl"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="text-indigo-400 hover:text-indigo-300"
            >
              + Tambah link lain
            </button>
          </div>

          <button type="submit" className="w-full bg-indigo-600 py-5 rounded-xl font-bold hover:bg-indigo-700">
            Buat Profile
          </button>
        </form>

        {status && <p className="mt-8 text-center text-lg">{status}</p>}
      </div>
    </main>
  );
}
