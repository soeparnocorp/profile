import { redirect } from 'next/navigation';

export default function CreateProfilePage() {
  async function createProfile(formData: FormData) {
    'use server';

    const username = (formData.get('username') as string)?.trim().toLowerCase().replace(/^@/, '');
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string || '';

    if (!username || !name) {
      // Untuk error sederhana, bisa return object atau throw
      throw new Error('Username dan nama wajib diisi!');
    }

    try {
      // Simpan ke D1 (PROFILE_DB)
      await env.PROFILE_DB.prepare(
        'INSERT OR REPLACE INTO profiles (username, name, bio, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      )
        .bind(username, name, bio)
        .run();

      // Cache di KV
      await env.PROFILE_KV.put(`profile:${username}`, JSON.stringify({ name, bio }), { expirationTtl: 86400 });

      // Redirect ke Astro
      redirect(`https://readtalk.pages.dev/@${username}`);
    } catch (err) {
      console.error(err);
      throw err; // akan muncul error di form
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <h1 className="text-5xl font-bold mb-8 text-center">Buat Profile Biodata</h1>
        <form action={createProfile} className="space-y-6">
          <input name="username" placeholder="@username (tanpa spasi)" required className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none" />
          <input name="name" placeholder="Nama tampilan" required className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none" />
          <textarea name="bio" placeholder="Bio singkat (opsional)" className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl h-32 focus:border-indigo-500 focus:outline-none" />
          <button type="submit" className="w-full bg-indigo-600 py-5 rounded-xl font-bold hover:bg-indigo-700 transition">
            Buat Profile
          </button>
        </form>
      </div>
    </main>
  );
}
