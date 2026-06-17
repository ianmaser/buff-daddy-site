import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sanitize } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rateLimit';

function buildContactEmailHtml(
  name: string,
  email: string,
  subject: string,
  message: string,
): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0D0E2B;">
      <div style="background:#0D0E2B;padding:24px;border-radius:8px 8px 0 0;">
        <h1 style="color:#00D4C8;font-size:28px;margin:0;letter-spacing:2px;">NEW MESSAGE</h1>
        <p style="color:#FF3EA5;margin:4px 0 0;">Buff Daddy's Contact Form</p>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:6px 0;color:#6B7280;width:100px;">Name</td><td style="padding:6px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;">Email</td><td style="padding:6px 0;font-weight:600;">${email}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;">Subject</td><td style="padding:6px 0;font-weight:600;">${subject}</td></tr>
        </table>
        <h3 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6B7280;">Message</h3>
        <p style="margin:0;line-height:1.6;color:#0D0E2B;white-space:pre-wrap;">${message}</p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  if (!rateLimit(ip, 3, 60_000)) {
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

    const { name, email, subject, message } = body as Record<string, unknown>;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanSubject = sanitize(subject);
    const cleanMessage = sanitize(message);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL ?? '',
      subject: `Contact: ${cleanSubject} — from ${cleanName}`,
      html: buildContactEmailHtml(cleanName, cleanEmail, cleanSubject, cleanMessage),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/contact] Unhandled error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
