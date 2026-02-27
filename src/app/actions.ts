// app/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { getDB, getKV } from '@/lib/db';

export async function saveProfile(formData: FormData) {
  // 1. Validasi input
  const usernameRaw = (formData.get('username') as string)?.trim() || '';
  const username = usernameRaw.startsWith('@') ? usernameRaw.slice(1).toLowerCase() : usernameRaw.toLowerCase();
  const name = (formData.get('name') as string)?.trim() || '';
  const bio = (formData.get('bio') as string)?.trim() || '';

  // Validasi username
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(username)) {
    throw new Error('Username hanya boleh huruf, angka, underscore (3-30 karakter)');
  }

  // 2. Kumpulkan links
  const links = [];
  for (let i = 1; i <= 5; i++) {
    const label = (formData.get(`link${i}_label`) as string)?.trim() || '';
    const url = (formData.get(`link${i}_url`) as string)?.trim() || '';
    if (label && url) {
      links.push({ label, url });
    }
  }

  try {
    // 3. Dapatkan koneksi database
    const db = getDB();
    const kv = getKV();

    // 4. Cek apakah username sudah dipakai
    const existing = await db.prepare(
      'SELECT id FROM profiles WHERE username = ?'
    ).bind(username).first();

    if (existing) {
      throw new Error('Username sudah dipakai, pilih yang lain');
    }

    // 5. Simpan ke database
    await db.prepare(`
      INSERT INTO profiles (username, name, bio, links, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      username, 
      name, 
      bio, 
      JSON.stringify(links), 
      Date.now()
    ).run();

    // 6. Hapus cache lama (kalau ada)
    await kv.delete(`profile:${username}`);

    // 7. Redirect ke halaman publik
    redirect(`https://readtalk.pages.dev/@${username}`);

  } catch (error) {
    // 8. Error handling
    console.error('Save profile error:', error);
    throw new Error('Gagal menyimpan profile: ' + (error as Error).message);
  }
}
