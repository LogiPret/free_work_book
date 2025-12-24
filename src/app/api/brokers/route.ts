import { NextRequest, NextResponse } from 'next/server';
import { getAllBrokers, createBroker } from '@/lib/brokers';

export async function GET() {
  try {
    const brokers = await getAllBrokers();
    return NextResponse.json(brokers);
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return NextResponse.json({ error: 'Failed to fetch brokers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ['name', 'slug', 'agence', 'phone', 'email'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const broker = await createBroker(body);
    return NextResponse.json(broker, { status: 201 });
  } catch (error) {
    console.error('Error creating broker:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create broker' },
      { status: 500 }
    );
  }
}
