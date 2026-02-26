import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';
import { listMedicines, createMedicine } from '@/lib/db/medicines';

function requirePharmacist(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const user = decodeAuthPayload(token);
  return user?.role === 'PHARMACIST' ? user : null;
}

export async function GET(req: NextRequest) {
  const user = requirePharmacist(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const medicines = await listMedicines(user.id);
    return NextResponse.json({ medicines });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const user = requirePharmacist(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { name?: string; category?: string; quantity?: number; price?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.name || body.quantity === undefined || body.price === undefined) {
    return NextResponse.json(
      { error: 'name, quantity, and price are required' },
      { status: 400 }
    );
  }

  try {
    const medicine = await createMedicine(user.id, {
      name: body.name,
      category: body.category ?? '',
      quantity: body.quantity,
      price: body.price,
    });
    return NextResponse.json({ medicine }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
