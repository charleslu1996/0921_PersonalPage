import { NextRequest, NextResponse } from 'next/server';
import { queryWeatherForecastsFromDb, getDatabaseStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationParam = searchParams.get('location') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const stats = getDatabaseStats();
    const records = queryWeatherForecastsFromDb(locationParam, limit);

    return NextResponse.json({
      success: true,
      stats,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    console.error('API /api/db error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to query database',
      },
      { status: 500 }
    );
  }
}
