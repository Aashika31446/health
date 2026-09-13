import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'CuraMindAI-HealthcareApp/1.0'
      },
      body: body,
    });

    if (!res.ok) {
      return NextResponse.json({ elements: [] });
    }

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      // Overpass returned non-JSON HTML error page
      return NextResponse.json({ elements: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ elements: [] });
  }
}
