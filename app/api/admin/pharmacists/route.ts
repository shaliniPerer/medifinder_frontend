import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';
import { listPharmacists, createUser, getUserByEmail } from '@/lib/db/users';

function requireAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  const user = decodeAuthPayload(token);
  return user?.role === 'SUPER_ADMIN';
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const pharmacists = await listPharmacists();
    // Shape into the format the admin dashboard expects
    const records = pharmacists.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      pharmacy: u.pharmacyName ?? '',
      status: u.status,
      createdAt: u.createdAt,
    }));
    return NextResponse.json({ pharmacists: records });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { name?: string; email?: string; pharmacy?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.name || !body.email || !body.pharmacy || !body.password) {
    return NextResponse.json(
      { error: 'name, email, pharmacy, and password are required' },
      { status: 400 }
    );
  }

  try {
    const existing = await getUserByEmail(body.email);
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const newUser = {
      email: body.email,
      id: randomUUID(),
      name: body.name,
      role: 'PHARMACIST' as const,
      passwordHash,
      pharmacyName: body.pharmacy,
      status: 'active' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };
    await createUser(newUser);

    return NextResponse.json(
      {
        pharmacist: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          pharmacy: newUser.pharmacyName,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
