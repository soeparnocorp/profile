// app/api/profile/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProfileByUsername } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username.toLowerCase();

    // Validasi input
    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: 'Username invalid' },
        { status: 400 }
      );
    }

    // Ambil profile dari database/cache
    const profile = await getProfileByUsername(username);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Return dengan cache headers
    return new NextResponse(JSON.stringify(profile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache 1 jam di browser
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
