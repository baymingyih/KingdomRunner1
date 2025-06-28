import { StravaTokens, saveStravaTokens as dbSaveStravaTokens, getStravaTokens } from '@/lib/db/stravaTokens';

// Re-export for convenience
export { saveStravaTokens } from '@/lib/db/stravaTokens';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
  city: string;
  country: string;
}

interface StravaTokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: StravaAthlete;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  location_city?: string;
  location_country?: string;
  map?: {
    summary_polyline: string;
  };
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  type: string;
}

export class StravaError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'StravaError';
  }
}

function validateConfig() {
  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REDIRECT_URI) {
    throw new StravaError(
      'Missing Strava client configuration',
      'MISSING_CONFIG'
    );
  }
}

export function getStravaAuthUrl(state?: string): string {
  validateConfig();
  const url = new URL('https://www.strava.com/oauth/authorize');
  url.searchParams.append('client_id', STRAVA_CLIENT_ID!);
  url.searchParams.append('redirect_uri', STRAVA_REDIRECT_URI!);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'activity:read_all');
  if (state) {
    url.searchParams.append('state', state);
  }
  return url.toString();
}

export async function exchangeCodeForToken(code: string): Promise<StravaTokens> {
  validateConfig();

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new StravaError(
        error.message || 'Failed to exchange code for token',
        'TOKEN_EXCHANGE_ERROR',
        response.status
      );
    }

    const data = (await response.json()) as StravaTokenResponse;
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      athleteId: data.athlete?.id,
      athleteName: data.athlete ? `${data.athlete.firstname} ${data.athlete.lastname}` : undefined,
      athleteProfile: data.athlete?.profile,
      athleteCity: data.athlete?.city,
      athleteCountry: data.athlete?.country
    };
  } catch (error) {
    if (error instanceof StravaError) throw error;
    throw new StravaError(
      'Failed to exchange code for token',
      'TOKEN_EXCHANGE_ERROR'
    );
  }
}

export async function refreshAccessToken(tokens: StravaTokens, userId?: string): Promise<StravaTokens> {
  validateConfig();

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: tokens.refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new StravaError(
        error.message || 'Failed to refresh token',
        'TOKEN_REFRESH_ERROR',
        response.status
      );
    }

    const data = (await response.json()) as StravaTokenResponse;
    const newTokens = {
      ...tokens,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at
    };

    if (userId) {
      await dbSaveStravaTokens(userId, newTokens);
    }

    return newTokens;
  } catch (error) {
    if (error instanceof StravaError) throw error;
    throw new StravaError(
      'Failed to refresh token',
      'TOKEN_REFRESH_ERROR'
    );
  }
}

export async function fetchStravaActivities(
  userId: string,
  params: {
    page?: number;
    per_page?: number;
    before?: number;
    after?: number;
  } = {}
): Promise<StravaActivity[]> {
  try {
    let tokens = await getStravaTokens(userId);
    if (!tokens) {
      throw new StravaError(
        'Not authenticated with Strava',
        'NOT_AUTHENTICATED'
      );
    }

    // Check if token needs refresh
    if (Date.now() / 1000 >= tokens.expiresAt - 60) {
      tokens = await refreshAccessToken(tokens, userId);
    }

    const url = new URL('https://www.strava.com/api/v3/athlete/activities');
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new StravaError(
        error.message || 'Failed to fetch activities',
        'FETCH_ACTIVITIES_ERROR',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof StravaError) throw error;
    throw new StravaError(
      'Failed to fetch activities',
      'FETCH_ACTIVITIES_ERROR'
    );
  }
}

export async function getStravaConnectionStatus(userId: string): Promise<{
  connected: boolean;
  athlete?: {
    id: number;
    name: string;
    profile?: string;
    city?: string;
    country?: string;
  };
}> {
  try {
    const tokens = await getStravaTokens(userId);
    if (!tokens) {
      return { connected: false };
    }

    return {
      connected: true,
      athlete: tokens.athleteId ? {
        id: tokens.athleteId,
        name: tokens.athleteName || 'Strava Athlete',
        profile: tokens.athleteProfile,
        city: tokens.athleteCity,
        country: tokens.athleteCountry
      } : undefined
    };
  } catch (error) {
    console.error('Error checking Strava connection status:', error);
    return { connected: false };
  }
}
