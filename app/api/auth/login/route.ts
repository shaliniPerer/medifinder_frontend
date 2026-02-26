import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import { AUTH_COOKIE_NAME, AuthUser, encodeAuthPayload } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db/users';

function timingSafeStringEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) {
      // Still run a compare so timing is consistent; then return false
      timingSafeEqual(aBuf, Buffer.alloc(aBuf.length));
      return false;
    }
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Super admin: credentials come from environment variables
  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
  if (
    adminEmail &&
    adminPassword &&
    timingSafeStringEqual(email, adminEmail) &&
    timingSafeStringEqual(password, adminPassword)
  ) {
    const authUser: AuthUser = {
      id: 'super-admin',
      email: adminEmail,
      name: process.env.SUPER_ADMIN_NAME ?? 'Super Admin',
      role: 'SUPER_ADMIN',
    };
    return buildAuthResponse(authUser);
  }

  // Pharmacist: look up in DynamoDB
  let dbUser;
  try {
    dbUser = await getUserByEmail(email);
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  if (!dbUser) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (dbUser.status !== 'active') {
    return NextResponse.json(
      { error: 'Account is not active. Please contact the administrator.' },
      { status: 403 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, dbUser.passwordHash);
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const authUser: AuthUser = {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
  };
  return buildAuthResponse(authUser);
}

function buildAuthResponse(authUser: AuthUser): NextResponse {
  const token = encodeAuthPayload(authUser);
  const redirectTo =
    authUser.role === 'SUPER_ADMIN'
      ? '/portal/admin/dashboard'
      : '/portal/pharmacist/dashboard';
  const response = NextResponse.json({ user: authUser, redirectTo });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
