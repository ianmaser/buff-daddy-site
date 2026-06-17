import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import Airtable from 'airtable';
import { sanitize } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rateLimit';

interface OrderItem {
  itemName: string;
  qty: number;
}

function buildOrderEmailHtml(
  name: string,
  contact: string,
  pickupWindow: string,
  items: OrderItem[],
  notes: string,
): string {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:6px 12px;border-bottom:1px solid #eee;">${item.itemName}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
      </tr>`,
    )
    .join('');

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0D0E2B;">
      <div style="background:#0D0E2B;padding:24px;border-radius:8px 8px 0 0;">
        <h1 style="color:#FF3EA5;font-size:28px;margin:0;letter-spacing:2px;">NEW ORDER</h1>
        <p style="color:#00D4C8;margin:4px 0 0;">Buff Daddy's</p>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:6px 0;color:#6B7280;width:140px;">Name</td><td style="padding:6px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;">Contact</td><td style="padding:6px 0;font-weight:600;">${contact}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;">Pickup Window</td><td style="padding:6px 0;font-weight:600;">${pickupWindow}</td></tr>
        </table>
        <h3 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6B7280;">Items</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;border:1px solid #eee;border-radius:6px;overflow:hidden;">
          <thead>
            <tr style="background:#f9f9f9;">
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6B7280;text-transform:uppercase;">Item</th>
              <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6B7280;text-transform:uppercase;">Qty</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        ${notes ? `<p style="margin:0;color:#6B7280;font-size:14px;"><strong>Notes:</strong> ${notes}</p>` : ''}
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute.' },
      { status: 429 },
    );
  }

  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { name, contact, pickupWindow, items, notes } = body as Record<string, unknown>;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!contact || typeof contact !== 'string' || !contact.trim()) {
      return NextResponse.json({ error: 'Contact is required.' }, { status: 400 });
    }
    if (!pickupWindow || typeof pickupWindow !== 'string' || !pickupWindow.trim()) {
      return NextResponse.json({ error: 'Pickup window is required.' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required.' }, { status: 400 });
    }

    for (const item of items) {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof item.itemName !== 'string' ||
        !item.itemName.trim() ||
        typeof item.qty !== 'number' ||
        item.qty <= 0
      ) {
        return NextResponse.json(
          { error: 'Each item must have a name and a quantity greater than 0.' },
          { status: 400 },
        );
      }
    }

    const cleanName = sanitize(name);
    const cleanContact = sanitize(contact);
    const cleanPickupWindow = sanitize(pickupWindow);
    const cleanNotes = notes && typeof notes === 'string' ? sanitize(notes) : '';
    const cleanItems: OrderItem[] = (items as Array<{ itemName: string; qty: number }>).map(
      (item) => ({
        itemName: sanitize(item.itemName),
        qty: item.qty,
      }),
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL ?? '',
      subject: `New Order from ${cleanName}`,
      html: buildOrderEmailHtml(cleanName, cleanContact, cleanPickupWindow, cleanItems, cleanNotes),
    });

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID ?? '',
    );
    await base(process.env.AIRTABLE_TABLE_NAME ?? 'Orders').create([
      {
        fields: {
          Name: cleanName,
          Contact: cleanContact,
          PickupWindow: cleanPickupWindow,
          Items: JSON.stringify(cleanItems),
          Notes: cleanNotes,
          Status: 'New',
          CreatedAt: new Date().toISOString(),
        },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/orders] Unhandled error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
