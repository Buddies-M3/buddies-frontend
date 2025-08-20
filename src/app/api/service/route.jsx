import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, passportData, passportPhoto } = body;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    if (!passportData) {
      return NextResponse.json({ error: 'Passport data is required' }, { status: 400 });
    }

    // Forward the verification to the session-specific endpoint
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${request.headers.get('host')}` 
      : new URL(request.url).origin;
    const verificationUrl = `${baseUrl}/api/service/verification/${sessionId}`;
    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        passportData,
        photoBase64: passportPhoto
      })
    });

    if (!verificationResponse.ok) {
      throw new Error('Failed to process verification');
    }

    const result = await verificationResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing mobile verification request:', error);
    return NextResponse.json({ 
      error: 'Failed to process verification request' 
    }, { status: 500 });
  }
}