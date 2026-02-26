import { redirect } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  async function simpanProfile(formData: FormData) {
    'use server';

    const usernameRaw = (formData.get('username') as string)?.trim() || '';
    const username = usernameRaw.startsWith('@') ? usernameRaw.slice(1).toLowerCase() : usernameRaw.toLowerCase();
    const name = (formData.get('name') as string)?.trim() || '';
    const bio = (formData.get('bio') as string)?.trim() || '';

    const links = [];
    for (let i = 1; i <= 5; i++) {
      const label = (formData.get(`link${i}_label`) as string)?.trim() || '';
      const url = (formData.get(`link${i}_url`) as string)?.trim() || '';
      if (label && url) {
        links.push({ label, url });
      }
    }

    // Simpan ke console.log dulu (nanti ganti ke D1 kalau sudah siap)
    console.log('Profile baru disimpan:', { username, name, bio, links });

    // Redirect ke halaman display publik di Astro
    redirect(`https://readtalk.pages.dev/@${username}`);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-2xl w-full">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Buat Profile Gue
        </h1>
        <p className="text-center text-lg opacity-80">
          Identitas ini akan jadi bio utama di edgechat dan tampil di readtalk.pages.dev/@username
        </p>

        <form action={simpanProfile} className="w-full space-y-6 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
          {/* Avatar */}
          <div>
            <label className="block text-lg font-medium mb-2">Avatar / Foto Profil</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white file:bg-indigo-600 file:text-white file:border-none file:rounded file:px-4 file:py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
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

          {/* Bio */}
          <textarea
            name="bio"
            placeholder="Bio singkat"
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

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-xl font-bold text-lg transition mt-8"
          >
            Buat Profile & Buat Link Share
          </button>
        </form>

        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
