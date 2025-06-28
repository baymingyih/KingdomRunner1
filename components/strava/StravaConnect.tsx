"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { StravaIcon } from '@/components/icons/strava';

export interface StravaStatus {
  connected: boolean;
  athlete?: {
    id: number;
    name: string;
    profile?: string;
    city?: string;
    country?: string;
  };
}

interface StravaConnectProps {
  onConnected?: () => void;
  onStatusChange?: (status: StravaStatus) => void;
}

interface StravaStatusInternal {
  connected: boolean;
  athlete?: {
    id: number;
    name: string;
    profile?: string;
    city?: string;
    country?: string;
  };
}

export default function StravaConnect({ onConnected, onStatusChange }: StravaConnectProps) {
  const [status, setStatus] = useState<StravaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/strava/status');
      if (!response.ok) {
        throw new Error('Failed to check Strava status');
      }
      const data = await response.json();
      setStatus(data);
      if (onStatusChange) {
        onStatusChange(data);
      }
      if (data.connected && onConnected) {
        onConnected();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check Strava connection status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = '/api/strava/auth';
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking Strava connection...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-destructive">
        Error checking Strava connection status
      </div>
    );
  }

  if (status.connected) {
    const handleDisconnect = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/strava/disconnect', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to disconnect');
        }
        
        await checkStatus();
        toast({
          title: "Success",
          description: "Strava disconnected successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to disconnect from Strava",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex items-center gap-4">
        {status.athlete?.profile && (
          <img
            src={status.athlete.profile}
            alt={status.athlete.name}
            className="h-8 w-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            Connected to Strava
          </span>
          {status.athlete && (
            <span className="text-xs text-muted-foreground">
              as {status.athlete.name}
              {status.athlete.city && ` from ${status.athlete.city}`}
            </span>
          )}
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Disconnect"
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="bg-[#fc4c02] hover:bg-[#fc4c02]/90 text-white gap-2"
    >
      <StravaIcon className="h-4 w-4" />
      Connect with Strava
    </Button>
  );
}
