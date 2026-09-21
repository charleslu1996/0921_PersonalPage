import { NextRequest, NextResponse } from 'next/server';
import { fetchCwaForecasts } from '@/lib/cwa';
import { saveCountyWeathersToDb } from '@/lib/db';
import { WeatherApiResponse } from '@/types/weather';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationParam = searchParams.get('location');
    const forceRefresh = searchParams.get('refresh') === 'true';

    const { datasetDescription, updatedAt, data } = await fetchCwaForecasts(forceRefresh);

    // Persist/upsert into Database (FR-04 & design.md Section 8)
    try {
      saveCountyWeathersToDb(data, updatedAt);
    } catch (dbErr) {
      console.warn('Warning: Could not save to local DB:', dbErr);
    }

    let filteredData = data;
    if (locationParam) {
      filteredData = data.filter(
        (item) =>
          item.locationName.includes(locationParam) ||
          locationParam.includes(item.locationName)
      );
    }

    const response: WeatherApiResponse = {
      success: true,
      datasetDescription,
      updatedAt,
      data: filteredData,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('API /api/weather error:', error);
    return NextResponse.json(
      {
        success: false,
        datasetDescription: '',
        updatedAt: new Date().toISOString(),
        data: [],
        error: error.message || 'Failed to fetch weather data from CWA',
      },
      { status: 500 }
    );
  }
}
