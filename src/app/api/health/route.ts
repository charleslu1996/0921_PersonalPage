import { NextResponse } from 'next/server';
import { HealthResponse } from '@/types/weather';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cwaKey = process.env.CWA_API_KEY;
  const isConfigured = Boolean(cwaKey && cwaKey.length > 5);

  const health: HealthResponse = {
    status: isConfigured ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    cwaConfigured: isConfigured,
    version: '1.0.0',
  };

  return NextResponse.json(health);
}
