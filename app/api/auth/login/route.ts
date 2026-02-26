import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, AuthUser, encodeAuthPayload } from '@/lib/auth';

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'PHARMACIST' | 'SUPER_ADMIN';
}

const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'pharmacist@medifinder.com',
    password: 'pharma123',
    name: 'John Pharmacist',
    role: 'PHARMACIST',
  },
  {
    id: '2',
    email: 'admin@medifinder.com',
    password: 'admin123',
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
  },
  // Demo credentials from existing login page
  {
    id: '3',
    email: 'demo@pharmacy.com',
    password: 'demo123',
    name: 'Demo Pharmacist',
    role: 'PHARMACIST',
  },
];

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

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = encodeAuthPayload(authUser);

  const redirectTo =
    user.role === 'SUPER_ADMIN'
      ? '/portal/admin/dashboard'
      : '/portal/pharmacist/dashboard';

  const response = NextResponse.json({ user: authUser, redirectTo });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
