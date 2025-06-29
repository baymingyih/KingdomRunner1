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
  const { user } = useAuth();
  
  // Only access searchParams after ensuring we're on client side
  const searchParams = typeof window !== 'undefined' ? useSearchParams() : null;
  const success = searchParams?.get('success');
  const error = searchParams?.get('error');

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Strava Integration with Prayer Reflections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please log in to test the Strava integration and prayer reflection features.
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
          <CardTitle>Strava Integration with Prayer Reflections</CardTitle>
          <p className="text-muted-foreground">
            Connect your Strava account to import activities and add prayer reflections
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Connect to Strava</h3>
            <StravaConnect 
              onConnected={() => {}}
              onStatusChange={setStatus}
            />
          </div>

          {status?.connected && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Import Activities & Add Prayer Reflections</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">New Features Available:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Import Strava activities with detailed metrics</li>
                  <li>• Add prayer reflections to your imported activities</li>
                  <li>• Expandable activity cards with social features</li>
                  <li>• Community interaction (likes, comments, shares)</li>
                  <li>• Link physical fitness with spiritual growth</li>
                </ul>
              </div>
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