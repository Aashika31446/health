import { NextResponse } from 'next/server';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
];

export async function POST(req: Request) {
  try {
    const body = await req.text();

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'CuraMindApp/1.0 (https://curamind-mu.vercel.app; health-assistant-map)',
            'Accept': 'application/json',
          },
          body: body,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data && Array.isArray(data.elements)) {
              return NextResponse.json(data);
            }
          } catch {}
        }
      } catch (err) {
        // Continue to next mirror on timeout or error
      }
    }

    // Graceful fallback if all external mirrors fail/rate-limit: return empty elements array with 200 OK
    return NextResponse.json({ elements: [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ elements: [] }, { status: 200 });
  }
}
