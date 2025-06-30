"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { getAllUsers } from '@/lib/db/users';
import { getAllActivities } from '@/lib/db/activities';
import { events } from '@/lib/data/events';

interface AdminStatsData {
  totalUsers: number;
  totalEvents: number;
  totalActivities: number;
  totalDistance: number;
  activeUsers: number;
  recentActivities: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    totalEvents: 0,
    totalActivities: 0,
    totalDistance: 0,
    activeUsers: 0,
    recentActivities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, activities] = await Promise.all([
          getAllUsers(),
          getAllActivities(100) // Get more activities for stats
        ]);

        // Calculate stats
        const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentActivities = activities.filter(activity => 
          activity.timestamp >= oneWeekAgo
        ).length;
        
        const activeUserIds = new Set(
          activities
            .filter(activity => activity.timestamp >= oneWeekAgo)
            .map(activity => activity.userId)
        );

        setStats({
          totalUsers: users.length,
          totalEvents: events.length,
          totalActivities: activities.length,
          totalDistance: Math.round(totalDistance),
          activeUsers: activeUserIds.size,
          recentActivities
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      color: "text-blue-600"
    },
    {
      title: "Active Events",
      value: stats.totalEvents,
      icon: Calendar,
      description: "Running events",
      color: "text-green-600"
    },
    {
      title: "Total Activities",
      value: stats.totalActivities,
      icon: Activity,
      description: "Logged activities",
      color: "text-purple-600"
    },
    {
      title: "Total Distance",
      value: `${stats.totalDistance} km`,
      icon: MapPin,
      description: "Distance covered",
      color: "text-orange-600"
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: TrendingUp,
      description: "Active this week",
      color: "text-emerald-600"
    },
    {
      title: "Recent Activities",
      value: stats.recentActivities,
      icon: Clock,
      description: "This week",
      color: "text-red-600"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Create new events and manage existing ones
            </p>
            <p className="text-sm text-muted-foreground">
              • Manage user accounts and permissions
            </p>
            <p className="text-sm text-muted-foreground">
              • Monitor system activity and performance
            </p>
            <p className="text-sm text-muted-foreground">
              • Configure system settings and preferences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Storage</span>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Authentication</span>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Strava Integration</span>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}