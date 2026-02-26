import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';
import { listPharmacists, updateUser, deleteUser } from '@/lib/db/users';

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

  // Find the user record by id
  let pharmacists;
  try {
    pharmacists = await listPharmacists();
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const record = pharmacists.find((p) => p.id === id);
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Partial<{ name: string; pharmacy: string; status: 'active' | 'inactive' }>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const updated = await updateUser(record.email, {
      name: body.name,
      pharmacyName: body.pharmacy,
      status: body.status,
    });
    return NextResponse.json({
      pharmacist: {
        id: updated?.id ?? id,
        name: updated?.name ?? record.name,
        email: updated?.email ?? record.email,
        pharmacy: updated?.pharmacyName ?? record.pharmacyName,
        status: updated?.status ?? record.status,
        createdAt: updated?.createdAt ?? record.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  let pharmacists;
  try {
    pharmacists = await listPharmacists();
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const record = pharmacists.find((p) => p.id === id);
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    await deleteUser(record.email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
