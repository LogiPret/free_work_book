import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Look up broker by pdf_token
  const { data: broker, error } = await supabase
    .from('brokers')
    .select('pdf_url, pdf_token, name')
    .eq('pdf_token', token)
    .single();

  if (error || !broker || !broker.pdf_url) {
    return new NextResponse('PDF not found', { status: 404 });
  }

  // Fetch the PDF from Supabase Storage
  try {
    const response = await fetch(broker.pdf_url);

    if (!response.ok) {
      return new NextResponse('PDF not available', { status: 404 });
    }

    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="guide-${broker.name.toLowerCase().replace(/\s+/g, '-')}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('Error fetching PDF', { status: 500 });
  }
}
