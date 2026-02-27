// lib/db.ts
import { env } from 'cloudflare:workers';

export function getKV() {
  return env.PROFILE_KV;  // ← BENER! Pake PROFILE_KV
}

export function getDB() {
  return env.PROFILE_DB;  // ← BENER! Pake PROFILE_DB
}

export async function getProfileByUsername(username: string) {
  const kv = getKV();  // ← PROFILE_KV
  const db = getDB();  // ← PROFILE_DB

  // 1. Cek cache
  const cached = await kv.get(`profile:${username}`, 'json');
  if (cached) return cached;

  // 2. Ambil dari DB
  const profile = await db.prepare('SELECT * FROM profiles WHERE username = ?')
    .bind(username)
    .first();

  if (profile) {
    await kv.put(`profile:${username}`, JSON.stringify(profile), { 
      expirationTtl: 3600 
    });
  }

  return profile;
}
