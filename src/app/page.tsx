// src/app/page.tsx - Server Action version (no "use client", no fetch)
import { redirect } from 'next/navigation';

export default function CreateProfilePage() {
  async function createProfile(formData: FormData) {
    'use server';

    const username = (formData.get('username') as string)?.trim().toLowerCase().replace(/^@/, '');
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string || '';
    const linksJson = formData.get('links') as string || '[]'; // kalau loe tambah hidden input untuk links

    if (!username || !name) {
      throw new Error('Username dan nama wajib diisi!');
    }

    await env.PROFILE_DB.prepare(
      'INSERT OR REPLACE INTO profiles (username, name, bio, links, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
    )
      .bind(username, name, bio, linksJson)
      .run();

    await env.PROFILE_KV.put(`profile:${username}`, JSON.stringify({ name, bio, links: JSON.parse(linksJson) }), {
      expirationTtl: 86400 * 7,
    });

    redirect(`https://readtalk.pages.dev/@${username}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <h1 className="text-5xl font-bold mb-8 text-center">Buat Profile Linktree</h1>
        <form action={createProfile} className="space-y-6">
          {/* input username, name, bio seperti sebelumnya */}
          {/* untuk links, bisa pakai hidden input atau multiple name="links[]" */}
          <button type="submit" className="w-full bg-indigo-600 py-5 rounded-xl font-bold hover:bg-indigo-700">
            Buat Profile
          </button>
        </form>
      </div>
    </main>
  );
}
