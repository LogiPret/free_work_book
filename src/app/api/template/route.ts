import { NextResponse } from 'next/server';
import { getTemplateConfig, saveTemplateConfig, TemplateConfig } from '@/lib/template';

export async function GET() {
  const config = await getTemplateConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  try {
    const config: TemplateConfig = await request.json();
    const success = await saveTemplateConfig(config);

    if (!success) {
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save' },
      { status: 500 }
    );
  }
}
