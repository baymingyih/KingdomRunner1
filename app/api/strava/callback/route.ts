import { NextResponse } from 'next/server';
import { exchangeCodeForToken, saveStravaTokens, StravaError } from '@/lib/strava';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_BASE_URL 
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` 
  : 'http://localhost:3000/dashboard';

function redirectWithError(error: string) {
  return NextResponse.redirect(`${DASHBOARD_URL}?error=${encodeURIComponent(error)}`, { status: 302 });
}

function redirectWithSuccess() {
  return NextResponse.redirect(`${DASHBOARD_URL}?success=strava_connected`, { status: 302 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Handle Strava OAuth errors
  if (error) {
    console.error('Strava OAuth error:', error);
    return redirectWithError(error);
  }

  if (!code) {
    return redirectWithError('missing_auth_code');
  }

  if (!state) {
    return redirectWithError('invalid_state');
  }

  try {
    // Decode and validate state parameter
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    
    if (!stateData.userId || !stateData.timestamp) {
      throw new StravaError('Invalid state parameter', 'INVALID_STATE');
    }

    // Check if state is expired (30 minutes)
    if (Date.now() - stateData.timestamp > 30 * 60 * 1000) {
      throw new StravaError('State parameter expired', 'STATE_EXPIRED');
    }

    const tokens = await exchangeCodeForToken(code);
    await saveStravaTokens(stateData.userId, tokens);

    return redirectWithSuccess();
  } catch (error) {
    console.error('Strava callback error:', error);
    
    let errorCode = 'unknown_error';
    if (error instanceof StravaError) {
      errorCode = error.code?.toLowerCase() || 'strava_error';
    }

    return redirectWithError(errorCode);
  }
}
