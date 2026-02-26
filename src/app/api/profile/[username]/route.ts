export async function GET({ params }) {
  const username = params.username.toLowerCase();

  let profile = await env.PROFILE_KV.get(`profile:${username}`, { type: 'json' });

  if (!profile) {
    profile = await env.PROFILE_DB.prepare('SELECT * FROM profiles WHERE username = ?')
      .bind(username)
      .first();
    if (profile) {
      await env.PROFILE_KV.put(`profile:${username}`, JSON.stringify(profile), { expirationTtl: 3600 });
    }
  }

  if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json(profile);
}
