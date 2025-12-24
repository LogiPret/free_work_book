import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

// Initialize Twilio client
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Format phone number to E.164 format
function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // If it starts with 1 and has 11 digits, it's already correct (US/Canada)
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // If it has 10 digits, assume US/Canada and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If it already starts with +, return as is
  if (phone.startsWith('+')) {
    return phone.replace(/[^\d+]/g, '');
  }

  // Default: add + prefix
  return `+${digits}`;
}

// Send SMS via Twilio (fire-and-forget)
async function sendSms(to: string, message: string): Promise<void> {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('[SMS] Twilio not configured, skipping SMS');
    console.log('[SMS] Would send to:', to);
    console.log('[SMS] Message:', message);
    return;
  }

  try {
    const formattedTo = formatPhoneNumber(to);
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo,
    });
    console.log('[SMS] Sent successfully to:', formattedTo);
  } catch (error) {
    console.error('[SMS] Failed to send:', error);
  }
}

// Send email notification to broker (fire-and-forget)
async function sendBrokerNotification(
  brokerEmail: string,
  brokerName: string,
  userName: string,
  userPhone: string,
  primaryColor: string
): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('[EMAIL] Gmail not configured, skipping broker notification');
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${primaryColor};">Nouveau téléchargement de guide PDF</h2>
      <p>Un visiteur a demandé à recevoir votre guide PDF par SMS.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nom</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${userName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Téléphone</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="tel:${userPhone}">${userPhone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Date</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString('fr-CA', { timeZone: 'America/Montreal' })}</td>
        </tr>
      </table>
      
      <p style="color: #666; font-size: 14px;">
        Ce prospect a montré de l'intérêt pour votre guide. C'est une bonne occasion de faire un suivi!
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
        <p>Ceci est un message automatisé de votre plateforme de courtage.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: brokerEmail,
      subject: `Nouveau téléchargement de guide - ${userName}`,
      html,
    });
    console.log('[EMAIL] Broker notification sent to:', brokerEmail);
  } catch (error) {
    console.error('[EMAIL] Failed to send broker notification:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prenom, nom, telephone, brokerId } = body;

    // Validate required fields
    if (!prenom || !nom || !telephone || !brokerId) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    // Get the broker's PDF URL and token
    const { data: broker, error: brokerError } = await supabase
      .from('brokers')
      .select('pdf_url, pdf_token, name, email, primary_color')
      .eq('id', brokerId)
      .single();

    if (brokerError || !broker) {
      return NextResponse.json({ error: 'Courtier non trouvé' }, { status: 404 });
    }

    if (!broker.pdf_url || !broker.pdf_token) {
      return NextResponse.json({ error: 'Aucun PDF disponible pour ce courtier' }, { status: 400 });
    }

    // Build the public-facing PDF URL (using the website domain, not Supabase)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const publicPdfUrl = `${protocol}://${host}/pdf/${broker.pdf_token}`;

    // Store the PDF request in a new table for tracking
    const { error: insertError } = await supabase.from('pdf_requests').insert({
      broker_id: brokerId,
      prenom,
      nom,
      telephone,
      pdf_url: publicPdfUrl,
    });

    if (insertError) {
      console.error('Error storing PDF request:', insertError);
    }

    const userName = `${prenom} ${nom}`;
    const primaryColor = broker.primary_color || '#1e40af';

    // Build SMS message
    const smsMessage = `Salut! Ceci est un message automatisé de la part de ${broker.name}. Voici le lien pour voir le PDF: ${publicPdfUrl}`;

    // Send SMS to user and email to broker (fire-and-forget, don't block response)
    sendSms(telephone, smsMessage);
    sendBrokerNotification(broker.email, broker.name, userName, telephone, primaryColor);

    return NextResponse.json({
      success: true,
      message: 'Le guide sera envoyé par SMS',
    });
  } catch (error) {
    console.error('PDF request error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}
