// app/page.tsx
import { redirect } from 'next/navigation';
import Image from "next/image";
import { saveProfile } from './actions';

export default function Home() {
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

        <form action={saveProfile} className="w-full space-y-6 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
          {/* Username */}
          <div>
            <label className="block text-lg font-medium mb-2">Username</label>
            <input
              name="username"
              placeholder="@username (tanpa spasi)"
              required
              pattern="[a-zA-Z0-9_]{3,30}"
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Hanya huruf, angka, underscore. 3-30 karakter</p>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-lg font-medium mb-2">Nama Tampilan</label>
            <input
              name="name"
              placeholder="Nama kamu"
              required
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-lg font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              placeholder="Cerita singkat tentang kamu"
              rows={4}
              className="w-full p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Link Medsos (max 5)</h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  name={`link${i+1}_label`} 
                  placeholder={`Label ${i+1}`} 
                  className="p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none" 
                />
                <input 
                  name={`link${i+1}_url`} 
                  placeholder="https://..." 
                  className="p-5 bg-gray-800 border border-gray-700 rounded-xl focus:border-indigo-500 focus:outline-none" 
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-xl font-bold text-lg transition mt-8"
          >
            Buat Profile & Share Link
          </button>
        </form>
      </main>
    </div>
  );
}
