// src/app/page.tsx //
import { redirect } from 'next/navigation';

export default function CreateProfilePage() {
  async function createProfile(formData: FormData) {
    'use server';

    const username = (formData.get('username') as string)?.trim().toLowerCase().replace(/^@/, '');
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string || '';
    // Tambah links kalau mau, misal dari form array atau JSON string

    if (!username || !name) {
      throw new Error('Username dan nama wajib diisi!');
    }

    try {
      // Simpan ke D1 (PROFILE_DB) - pastikan table profiles sudah dibuat di dashboard D1
      await env.PROFILE_DB.prepare(
        'INSERT OR REPLACE INTO profiles (username, name, bio, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      )
        .bind(username, name, bio)
        .run();

      // Cache di KV (PROFILE_KV)
      await env.PROFILE_KV.put(`profile:${username}`, JSON.stringify({ name, bio }), {
        expirationTtl: 86400 * 7, // 1 minggu
      });

      // Redirect ke Astro profile page setelah sukses
      redirect(`https://readtalk.pages.dev/@${username}`);
    } catch (err) {
      console.error('Error simpan profile:', err);
      throw new Error('Gagal simpan profile. Coba lagi!');
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-950 text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <h1 className="text-5xl font-bold mb-8 text-center">Buat Profile Biodata Linktree</h1>
        <p className="text-xl mb-10 text-center opacity-90">
          Isi biodata loe di sini, nanti otomatis muncul di readtalk.pages.dev/@username
        </p>

        <form action={createProfile} className="space-y-6">
          <input
            name="username"
            placeholder="@username (tanpa spasi)"
            required
            pattern="[a-zA-Z0-9_]+"
            title="Hanya huruf, angka, underscore"
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
          />
          <input
            name="name"
            placeholder="Nama tampilan (Soeparno Enterprise)"
            required
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
          />
          <textarea
            name="bio"
            placeholder="Bio singkat (Entrepreneur | Builder | READTalk Messenger)"
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl h-32 focus:border-indigo-500 focus:outline-none"
          />
          {/* Kalau mau tambah links manual dulu, bisa pakai multiple input atau JSON field */}
          <button
            type="submit"
            className="w-full bg-indigo-600 py-5 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Buat & Simpan Profile
          </button>
        </form>
      </div>
    </main>
  );
}
