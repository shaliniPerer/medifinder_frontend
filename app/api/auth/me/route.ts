import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = decodeAuthPayload(token);

  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  return NextResponse.json({ user });
}
