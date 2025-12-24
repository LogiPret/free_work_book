import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getBrokerBySlug } from '@/lib/brokers';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function callN8nWebhook(body: Record<string, unknown>) {
  if (!process.env.N8N_WEBHOOK_URL) return null;
  try {
    const r = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { ok: r.ok, status: r.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const { name, email, phone, message, brokerSlug } = data;

    if (!name || !email || !message || !brokerSlug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message, brokerSlug' },
        { status: 400 }
      );
    }

    // Get broker to find their email
    const broker = await getBrokerBySlug(brokerSlug);
    if (!broker) {
      return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
    }

    const submission = {
      name,
      email,
      phone: phone || '',
      message,
      brokerSlug,
      brokerName: broker.name,
      brokerEmail: broker.email,
      timestamp: new Date().toISOString(),
    };

    // Send to n8n webhook if configured (non-blocking)
    const webhookPromise = callN8nWebhook(submission);

    // Build email HTML
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${broker.primary_color || '#1e40af'};">Nouvelle demande de contact</h2>
        <p>Vous avez reçu une nouvelle demande depuis votre page de destination.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nom</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Courriel</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <a href="mailto:${email}">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Téléphone</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              ${phone ? `<a href="tel:${phone}">${phone}</a>` : '—'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${message.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
        
        <p style="color: #666; font-size: 12px;">
          Soumis le ${new Date().toLocaleString('fr-CA', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
      </div>
    `;

    // Send email to broker (or dev test email in development)
    // Fire-and-forget: don't await, respond immediately to user
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const isDev = process.env.NODE_ENV === 'development';
      const devEmail = process.env.DEV_TEST_EMAIL;
      const recipientEmail = isDev && devEmail ? devEmail : broker.email;

      // Add dev mode indicator to subject if testing
      const subject =
        isDev && devEmail
          ? `[DEV TEST - ${broker.name}] Nouvelle demande de ${name}`
          : `Nouvelle demande de ${name} - ${broker.company}`;

      // Send email in background - don't block the response
      transporter
        .sendMail({
          from: process.env.GMAIL_USER,
          to: recipientEmail,
          replyTo: email,
          subject,
          html:
            isDev && devEmail
              ? `<div style="background: #fef3c7; padding: 10px; margin-bottom: 20px; border-radius: 4px;"><strong>DEV MODE:</strong> This would be sent to ${broker.email} in production</div>${html}`
              : html,
        })
        .catch((err) => console.error('Email send error:', err));
    }

    // Webhook also fire-and-forget
    webhookPromise.catch(() => {});

    // Respond immediately
    return NextResponse.json({ ok: true, message: 'Submission received' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit' },
      { status: 500 }
    );
  }
}
