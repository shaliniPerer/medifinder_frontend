import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';
import { createMedicine } from '@/lib/db/medicines';

function requirePharmacist(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const user = decodeAuthPayload(token);
  return user?.role === 'PHARMACIST' ? user : null;
}

/**
 * Extracts the Google Sheets spreadsheet ID from various URL formats:
 *   https://docs.google.com/spreadsheets/d/<ID>/edit...
 *   https://docs.google.com/spreadsheets/d/<ID>/pub...
 */
function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? null;
}

interface SheetRow {
  name?: string;
  category?: string;
  quantity?: string | number;
  price?: string | number;
}

export async function POST(req: NextRequest) {
  const user = requirePharmacist(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Sheets API key not configured' },
      { status: 503 }
    );
  }

  let body: { sheetUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.sheetUrl) {
    return NextResponse.json({ error: 'sheetUrl is required' }, { status: 400 });
  }

  const sheetId = extractSheetId(body.sheetUrl);
  if (!sheetId) {
    return NextResponse.json({ error: 'Invalid Google Sheets URL' }, { status: 400 });
  }

  // Fetch sheet data via the Sheets API (values from the first sheet, range A:Z)
  const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Z?key=${apiKey}`;
  let sheetsRes: Response;
  try {
    sheetsRes = await fetch(sheetsUrl);
  } catch {
    return NextResponse.json({ error: 'Failed to reach Google Sheets API' }, { status: 502 });
  }

  if (!sheetsRes.ok) {
    const err = await sheetsRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: err?.error?.message ?? 'Failed to fetch sheet data' },
      { status: sheetsRes.status }
    );
  }

  const sheetsData = await sheetsRes.json();
  const rows: string[][] = sheetsData.values ?? [];

  if (rows.length < 2) {
    return NextResponse.json({ error: 'Sheet has no data rows' }, { status: 400 });
  }

  // First row is headers; normalise to lower case
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const nameIdx = headers.indexOf('name');
  const categoryIdx = headers.indexOf('category');
  const quantityIdx = headers.indexOf('quantity');
  const priceIdx = headers.indexOf('price');

  if (nameIdx === -1 || quantityIdx === -1 || priceIdx === -1) {
    return NextResponse.json(
      { error: 'Sheet must have columns: name, quantity, price (category is optional)' },
      { status: 400 }
    );
  }

  const imported: { name: string }[] = [];
  const errors: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[nameIdx]?.trim();
    const quantity = parseInt(row[quantityIdx] ?? '0', 10);
    const price = parseFloat(row[priceIdx] ?? '0');
    const category = categoryIdx !== -1 ? (row[categoryIdx]?.trim() ?? '') : '';

    if (!name) {
      errors.push(`Row ${i + 1}: missing name`);
      continue;
    }
    if (isNaN(quantity) || isNaN(price)) {
      errors.push(`Row ${i + 1}: invalid quantity or price`);
      continue;
    }

    try {
      await createMedicine(user.id, { name, category, quantity, price });
      imported.push({ name });
    } catch {
      errors.push(`Row ${i + 1}: failed to save "${name}"`);
    }
  }

  return NextResponse.json({ imported: imported.length, errors });
}
