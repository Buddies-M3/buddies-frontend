import { NextResponse } from 'next/server';
import { parse, format } from 'date-fns';

// In-memory storage for verification sessions (in production, use database)
const verificationSessions = new Map();

// Global variable to store socket.io instance
let io;

// Helper function to format dates from passport data
function formatPassportDate(dateStr, isIssueDate = false) {

  if (!dateStr) return 'N/A';

  if (isIssueDate) console.warn(`Formatting issue date: ${dateStr}`);
  
  try {
    if (isIssueDate && dateStr.length === 8) {
      // Issue date format: YYYYMMDD (e.g., "20230123")
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      const parsed = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "dd-MMM-yyyy");
      }
    } else if (dateStr.length === 6) {
      // Expiry/birth date format: YYMMDD (e.g., "330122")
      const year = dateStr.slice(0, 2);
      const month = dateStr.slice(2, 4);
      const day = dateStr.slice(4, 6);
      const fullYear = parseInt(year) + 2000;
      const parsed = new Date(fullYear, parseInt(month) - 1, parseInt(day));
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "dd-MMM-yyyy");
      }
    }
    
    // If parsing fails, return original string
    return dateStr;
  } catch (error) {
    console.warn(`Failed to format date: ${dateStr}`, error);
    return dateStr;
  }
}

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

    console.log(`Passport data received for session: ${sessionId}`, passportData);
    
    if (!passportData) {
      return NextResponse.json({ error: 'Passport data required' }, { status: 400 });
    }

    // Store the verification data
    const photoUrl = photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : null;
    
    const verificationResult = {
      verified: true,
      passportData: {
        ...passportData,
        photoUrl,
        // Format dates for display
        issueDate: formatPassportDate(passportData.issueDate, true),
        expiryDate: formatPassportDate(passportData.expiryDate),
        dateOfBirth: formatPassportDate(passportData.dateOfBirth)
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