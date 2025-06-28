"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StravaConnect, { StravaStatus } from '@/components/strava/StravaConnect';
import StravaActivities from '@/components/strava/StravaActivities';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TestStravaPage() {
  const [status, setStatus] = useState<StravaStatus | null>(null);
  const [showActivities, setShowActivities] = useState(false);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Strava Integration Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please log in to test the Strava integration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {success === 'strava_connected' && (
        <Alert className="bg-green-500/15 text-green-500 border-green-500/30">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your Strava account has been successfully connected!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-destructive/15 text-destructive border-destructive/30">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error === 'missing_auth_code'
              ? 'Failed to connect to Strava. Please try again.'
              : error === 'invalid_state'
              ? 'Invalid authentication state. Please try again.'
              : error === 'state_expired'
              ? 'Authentication request expired. Please try again.'
              : 'An error occurred while connecting to Strava.'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Strava Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connection Status</h3>
            <StravaConnect 
              onConnected={() => setShowActivities(true)}
              onStatusChange={setStatus}
            />
          </div>

          {status?.connected && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
              <StravaActivities 
                eventId={1} 
                onActivityLogged={() => {
                  // Handle activity logged
                }} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
