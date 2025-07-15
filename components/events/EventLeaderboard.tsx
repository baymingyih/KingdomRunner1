"use client"

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RefreshCw, Pause, Play } from 'lucide-react';
import { Runner } from '@/lib/data/events';
import { useLeaderboard } from './hooks/useLeaderboard';
import ReactCountryFlag from 'react-country-flag';

interface EventLeaderboardProps {
  eventId: string;
}

export function EventLeaderboard({ eventId }: EventLeaderboardProps) {
  const { loading, error, leaderboard, lastUpdated, refreshLeaderboard } = useLeaderboard(eventId);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 60 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshLeaderboard();
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshLeaderboard]);

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading leaderboard</p>
        <Button onClick={refreshLeaderboard} className="mt-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant="outline"
            className="flex items-center gap-1 h-8 px-3 py-1"
            title={autoRefresh ? "Pause auto-refresh" : "Enable auto-refresh"}
          >
            {autoRefresh ? (
              <>
                <Pause className="h-4 w-4" />
                <span className="hidden sm:inline">Auto</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Auto</span>
              </>
            )}
          </Button>
          <Button 
            onClick={refreshLeaderboard}
            variant="outline"
            className="flex items-center gap-1 h-8 px-3 py-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[500px]">
        {/* Mobile View */}
        <div className="md:hidden">
          {leaderboard.map((runner, index) => (
            <div key={runner.id} className={`p-4 border-b ${index < 3 ? 'bg-muted/20' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg w-6 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                  <div>
                    <div className="font-medium">{runner.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {runner.country && (
                        <ReactCountryFlag 
                          countryCode={runner.country} 
                          svg 
                          style={{ width: '1.2em', height: '1.2em' }}
                          title={runner.country}
                        />
                      )}
                      {runner.country}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{runner.distance}km</div>
                  <div className="text-sm text-muted-foreground">{runner.activities} activities</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`h-2.5 rounded-full ${
                      index === 0 ? 'bg-yellow-400' : 
                      index === 1 ? 'bg-slate-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-primary'
                    }`} 
                    style={{ width: `${Math.min(100, (runner.distance / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No runners have logged activities yet
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Runner</th>
                <th className="p-4 text-left">Country</th>
                <th className="p-4 text-left">Distance</th>
                <th className="p-4 text-left">Progress</th>
                <th className="p-4 text-left">Activities</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((runner, index) => {
                let medal = null;
                if (index === 0) {
                  medal = <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-yellow-400 text-white font-bold">1</span>;
                } else if (index === 1) {
                  medal = <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-slate-400 text-white font-bold">2</span>;
                } else if (index === 2) {
                  medal = <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-orange-500 text-white font-bold">3</span>;
                }
                
                return (
                  <tr 
                    key={runner.id} 
                    className={`border-b ${index < 3 ? 'bg-muted/20' : ''}`}
                  >
                    <td className="p-4">
                      {medal || <span className="inline-flex justify-center items-center w-6 h-6">{index + 1}</span>}
                    </td>
                    <td className="p-4 font-medium">{runner.name}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2">
                        {runner.country ? (
                          <ReactCountryFlag 
                            countryCode={runner.country} 
                            svg 
                            style={{
                              width: '1.5em',
                              height: '1.5em',
                            }}
                            title={runner.country}
                          />
                        ) : (
                          <span className="text-xl">🌍</span>
                        )}
                        <span className="hidden lg:inline">{runner.country}</span>
                      </span>
                    </td>
                    <td className="p-4 font-medium">{runner.distance}km</td>
                    <td className="p-4 w-32">
                      <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className={`h-2.5 rounded-full ${
                            index === 0 ? 'bg-yellow-400' : 
                            index === 1 ? 'bg-slate-400' : 
                            index === 2 ? 'bg-orange-500' : 'bg-primary'
                          }`} 
                          style={{ width: `${Math.min(100, (runner.distance / 100) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round((runner.distance / 100) * 100)}%
                      </div>
                    </td>
                    <td className="p-4">{runner.activities}</td>
                  </tr>
                );
              })}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No runners have logged activities yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}
