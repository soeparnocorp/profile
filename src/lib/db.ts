// lib/db.ts
import { env } from 'cloudflare:workers';

// Database types
export interface Profile {
  username: string;
  name: string;
  bio: string;
  links: Array<{ label: string; url: string }>;
  avatar_url?: string;
  created_at: number;
}

// Get D1 database connection
export function getDB() {
  return env.DB;
}

// Get KV namespace for caching
export function getKV() {
  return env.KV;
}

// Helper: Get profile by username (with cache)
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const kv = getKV();
  const db = getDB();

  // 1. Try cache first
  const cached = await kv.get(`profile:${username}`, 'json');
  if (cached) {
    return cached as Profile;
  }

  // 2. Fallback to database
  const profile = await db.prepare(
    'SELECT username, name, bio, links, avatar_url, created_at FROM profiles WHERE username = ?'
  ).bind(username).first();

  if (profile) {
    // 3. Store in cache for 1 hour
    await kv.put(`profile:${username}`, JSON.stringify(profile), {
      expirationTtl: 3600
    });
  }

  return profile as Profile | null;
}

// Helper: Save profile
export async function saveProfileToDB(profile: Profile) {
  const db = getDB();
  const kv = getKV();

  await db.prepare(`
    INSERT INTO profiles (username, name, bio, links, avatar_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    profile.username,
    profile.name,
    profile.bio,
    JSON.stringify(profile.links),
    profile.avatar_url || null,
    profile.created_at
  ).run();

  // Invalidate cache
  await kv.delete(`profile:${profile.username}`);
}
