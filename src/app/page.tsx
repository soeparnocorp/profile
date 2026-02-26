// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function BuatProfilePage() {
  async function simpanProfile(formData: FormData) {
    'use server';

    const usernameRaw = (formData.get('username') as string)?.trim();
    const username = usernameRaw?.startsWith('@') ? usernameRaw.slice(1).toLowerCase() : usernameRaw?.toLowerCase() || '';
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string || '';

    // Ambil 5 link (label + url)
    const links = [];
    for (let i = 1; i <= 5; i++) {
      const label = formData.get(`link${i}_label`) as string || '';
      const url = formData.get(`link${i}_url`) as string || '';
      if (label && url) {
        links.push({ label, url });
      }
    }

    // Handle upload avatar ke R2
    const avatarFile = formData.get('avatar') as File | null;
    let avatarUrl = '';

    if (avatarFile && avatarFile.size > 0 && avatarFile.type.startsWith('image/')) {
      const extension = avatarFile.name.split('.').pop() || 'jpg';
      const fileName = `avatars/${username}-${Date.now()}.${extension}`;
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      await env.PROFILE_STORAGE.put(fileName, buffer, {
        httpMetadata: { contentType: avatarFile.type },
      });
      // Ganti dengan domain public R2 loe
      avatarUrl = `https://pub-<your-r2-hash>.r2.dev/${fileName}`; // atau custom domain R2 kalau loe sudah setup
    }

    // Validasi minimal
    if (!username || username.length < 3 || !name) {
      throw new Error('Username (minimal 3 karakter) dan nama wajib diisi!');
    }

    try {
      // Simpan ke D1
      await env.PROFILE_DB.prepare(
        `INSERT OR REPLACE INTO profiles 
         (username, name, bio, avatar_url, links, updated_at) 
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
        .bind(username, name, bio, avatarUrl, JSON.stringify(links))
        .run();

      // Cache di KV biar cepat
      await env.PROFILE_KV.put(`profile:${username}`, JSON.stringify({ name, bio, avatar_url: avatarUrl, links }), {
        expirationTtl: 86400 * 7, // 1 minggu
      });

      // Redirect ke halaman display di Astro
      redirect(`https://readtalk.pages.dev/@${username}`);
    } catch (err) {
      console.error('Gagal simpan:', err);
      throw new Error('Gagal menyimpan profile. Coba lagi atau hubungi support.');
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Buat Profile Gue</h1>
        <p className="text-center text-gray-400 mb-10">
          Isi biodata di bawah ini, nanti otomatis muncul di readtalk.pages.dev/@username
        </p>

        <form action={simpanProfile} className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-lg font-medium mb-2">Avatar / Foto Profil</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            <p className="text-xs text-gray-500 mt-1">Ukuran max 5MB, format JPG/PNG</p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-lg font-medium mb-2">@Username</label>
            <input
              name="username"
              placeholder="contoh: grok"
              required
              pattern="[a-zA-Z0-9_]{3,20}"
              title="3-20 karakter, huruf, angka, underscore"
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Nama */}
          <div>
            <label className="block text-lg font-medium mb-2">Nama Tampilan</label>
            <input
              name="name"
              placeholder="Soeparno Enterprise"
              required
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-lg font-medium mb-2">About / Bio</label>
            <textarea
              name="bio"
              placeholder="Entrepreneur | Builder | READTalk Messenger"
              rows={4}
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* 5 Link Medsos */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Link Medsos / Website (max 5)</h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4">
                <input
                  name={`link${i + 1}_label`}
                  placeholder={`Label ${i + 1} (misal: X / Twitter)`}
                  className="flex-1 p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
                <input
                  name={`link${i + 1}_url`}
                  placeholder="https://..."
                  className="flex-1 p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-xl font-bold text-lg transition mt-8"
          >
            Buat Profile Sekarang
          </button>
        </form>
      </div>
    </main>
  );
}
