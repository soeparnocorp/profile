// src/app/page.tsx - Halaman utama root, numpang form + handler
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Server Action untuk simpan identitas
  async function simpanIdentitas(formData: FormData) {
    'use server';

    const usernameRaw = (formData.get('username') as string)?.trim() || '';
    const username = usernameRaw.startsWith('@') ? usernameRaw.slice(1).toLowerCase() : usernameRaw.toLowerCase();
    const name = (formData.get('name') as string)?.trim() || '';
    const bio = (formData.get('bio') as string)?.trim() || '';

    const links = [];
    for (let i = 1; i <= 5; i++) {
      const label = (formData.get(`link${i}_label`) as string)?.trim() || '';
      const url = (formData.get(`link${i}_url`) as string)?.trim() || '';
      if (label && url) links.push({ label, url });
    }

    const avatarFile = formData.get('avatar') as File | null;
    let avatarUrl = '';

    if (avatarFile && avatarFile.size > 0 && avatarFile.type.startsWith('image/')) {
      const ext = avatarFile.name.split('.').pop() || 'jpg';
      const fileName = `avatars/${username}-${Date.now()}.${ext}`;
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      await env.PROFILE_STORAGE.put(fileName, buffer, {
        httpMetadata: { contentType: avatarFile.type },
      });
      avatarUrl = `https://pub-<HASH-R2-PUBLIC-LOE>.r2.dev/${fileName}`; // GANTI HASH PUBLIC R2 LOE
    }

    if (!username || username.length < 3 || !name) {
      throw new Error('Username minimal 3 karakter dan nama wajib!');
    }

    try {
      await env.PROFILE_DB.prepare(
        `INSERT OR REPLACE INTO profiles 
         (username, name, bio, avatar_url, links, updated_at) 
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
        .bind(username, name, bio, avatarUrl, JSON.stringify(links))
        .run();

      await env.PROFILE_KV.put(`profile:${username}`, JSON.stringify({
        name,
        bio,
        avatar_url: avatarUrl,
        links
      }), { expirationTtl: 604800 });

      // Redirect ke Astro display
      redirect(`https://readtalk.pages.dev/@${username}`);
    } catch (err) {
      console.error('Gagal simpan identitas:', err);
      throw new Error('Gagal menyimpan. Coba lagi!');
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-gray-900/60 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Buat Identitas Gue
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">
          Identitas ini akan jadi bio utama di edgechat & tampil di readtalk.pages.dev/@username
        </p>

        <form action={simpanIdentitas} className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-lg font-medium mb-2">Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white file:bg-indigo-600 file:text-white file:border-none file:rounded file:px-4 file:py-2"
            />
          </div>

          {/* Username */}
          <input
            name="username"
            placeholder="@username (tanpa spasi)"
            required
            pattern="[a-zA-Z0-9_]{3,30}"
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
          />

          {/* Nama */}
          <input
            name="name"
            placeholder="Nama tampilan"
            required
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
          />

          {/* Bio / About */}
          <textarea
            name="bio"
            placeholder="Bio identitas (akan dipakai di edgechat)"
            rows={4}
            className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
          />

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Link Medsos (max 5)</h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name={`link${i+1}_label`} placeholder="Label" className="p-5 bg-gray-800 border border-gray-700 rounded-xl" />
                <input name={`link${i+1}_url`} placeholder="https://" className="p-5 bg-gray-800 border border-gray-700 rounded-xl" />
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-indigo-600 py-5 rounded-xl font-bold hover:bg-indigo-700 mt-8">
            Simpan Identitas & Buat Link Share
          </button>
        </form>
      </div>
    </main>
  );
}
