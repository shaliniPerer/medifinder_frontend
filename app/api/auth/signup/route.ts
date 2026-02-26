import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getUserByEmail, createUser } from '@/lib/db/users';

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; password?: string; pharmacyName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, password, pharmacyName } = body;

  if (!name || !email || !password || !pharmacyName) {
    return NextResponse.json(
      { error: 'name, email, password, and pharmacyName are required' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // Prevent registering with the super admin email
  if (email === process.env.SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  let existing;
  try {
    existing = await getUserByEmail(email);
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await createUser({
      email,
      id: randomUUID(),
      name,
      role: 'PHARMACIST',
      passwordHash,
      pharmacyName,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
