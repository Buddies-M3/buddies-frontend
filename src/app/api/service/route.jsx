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
    const verificationUrl = new URL(`/api/service/verification/${sessionId}`, request.url);
    const verificationResponse = await fetch(verificationUrl.toString(), {
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