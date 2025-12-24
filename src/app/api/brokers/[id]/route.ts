import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { updateBroker, deleteBroker } from '@/lib/brokers';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { data, error } = await supabase.from('brokers').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching broker:', error);
    return NextResponse.json({ error: 'Failed to fetch broker' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const broker = await updateBroker(id, body);
    return NextResponse.json(broker);
  } catch (error) {
    console.error('Error updating broker:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update broker' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const success = await deleteBroker(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete broker' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting broker:', error);
    return NextResponse.json({ error: 'Failed to delete broker' }, { status: 500 });
  }
}
