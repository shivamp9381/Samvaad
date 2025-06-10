import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';
import { NextResponse } from 'next/server';

export async function GET() {
  const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
  const STREAM_API_SECRET = process.env.STREAM_API_SECRET!;
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const client = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  const iat = Math.floor(Date.now() / 1000) - 60;
  const token = client.createToken(user.id, exp, iat);

  return NextResponse.json({ token });
}
