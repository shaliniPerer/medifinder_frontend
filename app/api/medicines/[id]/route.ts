import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';
import { updateMedicine, deleteMedicine } from '@/lib/db/medicines';

function requirePharmacist(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const user = decodeAuthPayload(token);
  return user?.role === 'PHARMACIST' ? user : null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requirePharmacist(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  let body: Partial<{ name: string; category: string; quantity: number; price: number }>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const updated = await updateMedicine(user.id, id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ medicine: updated });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = requirePharmacist(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await deleteMedicine(user.id, id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
