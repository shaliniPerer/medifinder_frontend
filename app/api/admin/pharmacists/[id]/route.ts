import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';
import { mockPharmacistStore } from '@/lib/mock-data';

function requireAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  const user = decodeAuthPayload(token);
  return user?.role === 'SUPER_ADMIN';
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const index = mockPharmacistStore.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Partial<{ name: string; email: string; pharmacy: string; status: 'active' | 'inactive' }>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  mockPharmacistStore[index] = { ...mockPharmacistStore[index], ...body };
  return NextResponse.json({ pharmacist: mockPharmacistStore[index] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const index = mockPharmacistStore.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  mockPharmacistStore.splice(index, 1);
  return NextResponse.json({ success: true });
}
