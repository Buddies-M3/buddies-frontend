import { NextResponse } from 'next/server';

// In-memory storage for verification sessions (in production, use database)
const verificationSessions = new Map();

// Global variable to store socket.io instance
let io;

export async function GET(request, { params }) {
  try {
    const { sessionId } = params;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = verificationSessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json({ 
        verified: false, 
        message: 'Session not found or expired' 
      }, { status: 404 });
    }

    return NextResponse.json({
      verified: session.verified,
      passportData: session.verified ? session.passportData : null
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { sessionId } = params;
    const body = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const { passportData, photoBase64 } = body;
    
    if (!passportData) {
      return NextResponse.json({ error: 'Passport data required' }, { status: 400 });
    }

    // Store the verification data
    const photoUrl = photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : null;
    
    const verificationResult = {
      verified: true,
      passportData: {
        ...passportData,
        photoUrl
      },
      timestamp: Date.now()
    };
    
    verificationSessions.set(sessionId, verificationResult);

    console.log(`Passport verification completed for session: ${sessionId}`);
    
    // Clean up old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [id, session] of verificationSessions.entries()) {
      if (session.timestamp < oneHourAgo) {
        verificationSessions.delete(id);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification data received successfully' 
    });
  } catch (error) {
    console.error('Error processing verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}