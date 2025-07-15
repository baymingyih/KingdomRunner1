"use client"

import { useState, useEffect, useCallback } from 'react';
import { getEventActivities, Activity } from '@/lib/db/activities';
import { getUser } from '@/lib/db/users';
import { Runner } from '@/lib/data/events';

// Map of country names to ISO country codes
const countryCodeMap: Record<string, string> = {
  'US': 'US',
  'USA': 'US',
  'United States': 'US',
  'CN': 'CN',
  'China': 'CN',
  'ES': 'ES',
  'Spain': 'ES',
  'UK': 'GB',
  'United Kingdom': 'GB',
  'England': 'GB',
  'CA': 'CA',
  'Canada': 'CA',
  'AU': 'AU',
  'Australia': 'AU',
  'DE': 'DE',
  'Germany': 'DE',
  'FR': 'FR',
  'France': 'FR',
  'JP': 'JP',
  'Japan': 'JP',
  'IT': 'IT',
  'Italy': 'IT',
  'BR': 'BR',
  'Brazil': 'BR',
  'IN': 'IN',
  'India': 'IN',
  'RU': 'RU',
  'Russia': 'RU',
  'ZA': 'ZA',
  'South Africa': 'ZA',
  'MX': 'MX',
  'Mexico': 'MX',
  'KR': 'KR',
  'South Korea': 'KR',
  'NL': 'NL',
  'Netherlands': 'NL',
  'SE': 'SE',
  'Sweden': 'SE',
  'NO': 'NO',
  'Norway': 'NO',
  'NZ': 'NZ',
  'New Zealand': 'NZ',
  'SG': 'SG',
  'Singapore': 'SG',
  'CH': 'CH',
  'Switzerland': 'CH'
};

// Function to get a valid ISO country code
function getValidCountryCode(countryCode: string): string {
  // If it's already a valid 2-letter code in our map, return it
  if (countryCode.length === 2 && countryCodeMap[countryCode.toUpperCase()]) {
    return countryCode.toUpperCase();
  }
  
  // Check if we have a mapping for this country name/code
  const mappedCode = countryCodeMap[countryCode];
  if (mappedCode) {
    return mappedCode;
  }
  
  // Default to US if we can't find a valid code
  return 'US';
}

export function useLeaderboard(eventId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [leaderboard, setLeaderboard] = useState<Runner[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLeaderboardData = useCallback(async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      // Fetch all activities for this event
      const activities = await getEventActivities(eventId);
      
      // Group activities by user and calculate total distance
      const userMap = new Map<string, { 
        userId: string, 
        totalDistance: number,
        activities: number
      }>();
      
      // Process all activities
      activities.forEach(activity => {
        const userId = activity.userId;
        const userStats = userMap.get(userId) || { 
          userId, 
          totalDistance: 0, 
          activities: 0 
        };
        
        // Include both regular activities and Strava-imported ones
        userStats.totalDistance += activity.distance || 0;
        // Only count as activity if it's not a Strava import (since those are tracked separately)
        if (!activity.stravaActivityId) {
          userStats.activities += 1;
        }
        userMap.set(userId, userStats);
      });
      
      // Convert to array and fetch user details
      const leaderboardPromises = Array.from(userMap.entries()).map(async ([userId, stats]) => {
        try {
          const user = await getUser(userId);
          return {
            id: userId,
            name: user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}`
              : activities.find(a => a.userId === userId)?.userName || 'Unknown Runner',
            country: getValidCountryCode(user?.country || 'US'),
            distance: parseFloat(stats.totalDistance.toFixed(1)),
            prayers: stats.activities // Using activity count as prayer count for now
          } as Runner;
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return null;
        }
      });
      
      const leaderboardResults = await Promise.all(leaderboardPromises);
      const validResults = leaderboardResults.filter((item): item is Runner => item !== null);
      
      // Sort by distance (descending)
      const sortedLeaderboard = validResults.sort((a, b) => b.distance - a.distance);
      
      setLeaderboard(sortedLeaderboard);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError(error instanceof Error ? error : new Error('Failed to load leaderboard'));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Initial fetch
  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Function to manually refresh data
  const refreshLeaderboard = () => {
    fetchLeaderboardData();
  };

  return {
    loading,
    error,
    leaderboard,
    lastUpdated,
    refreshLeaderboard
  };
}
