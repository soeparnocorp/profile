export async function POST(request) {
  const body = await request.json();
  const { username, name, bio, links } = body;

  // Simpan ke D1
  await env.PROFILE_DB.prepare(
    'INSERT OR REPLACE INTO profiles (username, name, bio, links, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
  )
    .bind(username, name, bio, JSON.stringify(links))
    .run();

  // Cache di KV
  await env.PROFILE_KV.put(`profile:${username}`, JSON.stringify({ name, bio, links }), { expirationTtl: 86400 });

  return Response.json({ success: true });
}
