import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';
import { mockPharmacistStore, PharmacistRecord } from '@/lib/mock-data';

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
  return NextResponse.json({ pharmacists: mockPharmacistStore });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { name?: string; email?: string; pharmacy?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.name || !body.email || !body.pharmacy) {
    return NextResponse.json(
      { error: 'name, email, and pharmacy are required' },
      { status: 400 }
    );
  }

  const newRecord: PharmacistRecord = {
    id: String(Date.now()),
    name: body.name,
    email: body.email,
    pharmacy: body.pharmacy,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
  };

  mockPharmacistStore.push(newRecord);
  return NextResponse.json({ pharmacist: newRecord }, { status: 201 });
}
