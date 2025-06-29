"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { StravaActivity } from '@/lib/strava';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUser, createUser, type UserProfile } from '@/lib/db/users';
import { Loader2, Activity, Calendar, Trophy, Heart, MapPin, Clock, Target, Zap, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StravaConnect, type StravaStatus } from '@/components/strava/StravaConnect';
import { StravaReflectionDashboard } from '@/components/dashboard/StravaReflectionDashboard';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Format pace from m/s to min/km
const formatPace = (speed: number) => {
  if (!speed || speed <= 0) return "0:00";
  const pace = 1000 / speed / 60; // Convert m/s to min/km
  const minutes = Math.floor(pace);
  const seconds = Math.floor((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format time from seconds to HH:MM:SS
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Calculate stats from activities
const calculateStats = (activities: StravaActivity[]) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weeklyActivities = activities.filter(activity => 
    new Date(activity.start_date) >= oneWeekAgo
  );

  const weeklyDistance = weeklyActivities
    .reduce((sum, activity) => sum + activity.distance, 0) / 1000; // Convert to km

  const weeklyRuns = weeklyActivities.length;

  const averagePace = weeklyActivities.length > 0
    ? weeklyActivities.reduce((sum, activity) => sum + activity.average_speed, 0) / weeklyActivities.length
    : 0;

  const totalDistance = activities
    .reduce((sum, activity) => sum + activity.distance, 0) / 1000; // Convert to km

  const longestRun = activities.length > 0
    ? Math.max(...activities.map(activity => activity.distance)) / 1000
    : 0;

  const recentRuns = activities.slice(0, 3).map(activity => ({
    id: activity.id,
    name: activity.name,
    distance: (activity.distance / 1000).toFixed(1),
    time: formatTime(activity.moving_time),
    pace: formatPace(activity.average_speed),
    date: new Date(activity.start_date).toISOString().split('T')[0]
  }));

  return {
    weeklyDistance: weeklyDistance.toFixed(1),
    weeklyRuns,
    averagePace: formatPace(averagePace),
    totalDistance: totalDistance.toFixed(1),
    longestRun: longestRun.toFixed(1),
    recentRuns
  };
};

// Mock data for demonstration
const mockStravaStats = {
  weeklyDistance: "25.4",
  weeklyRuns: 4,
  averagePace: "5:30",
  totalDistance: "156.8",
  longestRun: "12.5",
  recentRuns: [
    { id: 1, name: "Morning Run", distance: "8.2", time: "45:20", pace: "5:31", date: "2025-01-15" },
    { id: 2, name: "Easy Recovery", distance: "5.0", time: "28:45", pace: "5:45", date: "2025-01-14" },
    { id: 3, name: "Tempo Run", distance: "6.5", time: "33:15", pace: "5:07", date: "2025-01-12" }
  ]
};

const mockEvents = [
  {
    id: 1,
    name: "#Glory Chasers - 100KM",
    date: "2025-04-14 to 2025-05-24",
    difficulty: "Intermediate",
    participants: 234,
    description: "40-day journey of faith and fitness",
    status: "upcoming"
  },
  {
    id: 2,
    name: "Prayer Walk Challenge",
    date: "2025-02-01 to 2025-02-28",
    difficulty: "Beginner",
    participants: 89,
    description: "Combine walking with daily prayer",
    status: "upcoming"
  }
];

const mockPrayerStats = {
  streak: 7,
  weeklyCompletion: 85,
  totalPrayers: 42,
  recentPrayers: [
    { id: 1, content: "Grateful for strength in today's run", date: "2025-01-15" },
    { id: 2, content: "Praying for perseverance in training", date: "2025-01-14" },
    { id: 3, content: "Thankful for this running community", date: "2025-01-13" }
  ]
};

export default function DashboardPage() {
  // All hooks must be called in the same order each render
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  // State declarations
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stravaStatus, setStravaStatus] = useState<StravaStatus | null>(null);
  const [stravaStats, setStravaStats] = useState<any>(null);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Effect hooks
  useEffect(() => {
    const loadUserData = async () => {
      if (!authLoading && !user) {
        router.push('/login');
        return;
      }

      if (user) {
        try {
          let userProfile = await getUser(user.uid);
          if (!userProfile) {
            console.log('Creating new user profile for', user.email);
            userProfile = await createUser({
              uid: user.uid,
              email: user.email || '',
              firstName: user.displayName?.split(' ')[0] || 'User',
              lastName: user.displayName?.split(' ')[1] || '',
              country: ''
            });
          }
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile. Please try logging in again.",
            variant: "destructive",
          });
          router.push('/login');
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [user, authLoading, router, toast]);

  useEffect(() => {
    const loadStravaActivities = async () => {
      if (stravaStatus?.connected) {
        setLoadingActivities(true);
        try {
          const response = await fetch(`/api/strava/activities?per_page=100`);
          if (response.ok) {
            const activities = await response.json();
            const runs = activities
              .filter((a: any) => a.type === 'Run')
              .sort((a: any, b: any) => 
                new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
            setStravaStats(calculateStats(runs));
          } else {
            console.error('Failed to fetch Strava activities:', response.status);
            toast({
              title: "Error",
              description: "Failed to fetch Strava activities",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error loading Strava activities:', error);
          toast({
            title: "Error",
            description: "Failed to load Strava activities",
            variant: "destructive",
          });
        } finally {
          setLoadingActivities(false);
        }
      }
    };

    loadStravaActivities();
  }, [stravaStatus, toast]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    console.log('No profile found - redirecting to login', {user, authLoading, loading});
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div {...fadeIn}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.firstName}!</h1>
            <p className="text-muted-foreground">Track your running journey and spiritual growth</p>
          </div>
          <div className="mt-4 md:mt-0">
            <StravaConnect onStatusChange={setStravaStatus} />
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="strava" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Strava + Prayer</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">My Activities</span>
          </TabsTrigger>
          <TabsTrigger value="prayers" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Prayers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Weekly Distance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {loadingActivities ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : (
                    stravaStats?.weeklyDistance || mockStravaStats.weeklyDistance
                  )} km
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {stravaStats ? "Your weekly progress" : "+12% from last week"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Prayer Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{mockPrayerStats.streak} days</div>
                <p className="text-xs text-green-600 mt-1">Keep it going! 🔥</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Weekly Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  {loadingActivities ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : (
                    stravaStats?.weeklyRuns || mockStravaStats.weeklyRuns
                  )}
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Target: {stravaStats ? "Keep it up!" : "5 runs"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Avg Pace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">
                  {loadingActivities ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : (
                    stravaStats?.averagePace || mockStravaStats.averagePace
                  )}
                </div>
                <p className="text-xs text-orange-600 mt-1">per km</p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Runs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stravaStatus?.connected ? (
                    (stravaStats?.recentRuns || mockStravaStats.recentRuns).map((run: any) => (
                      <div key={run.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{run.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {run.distance} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {run.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {run.pace}/km
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline">{run.date}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Connect Strava to see your recent runs</p>
                      <StravaConnect onStatusChange={setStravaStatus} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Prayer Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Completion</span>
                      <span>{mockPrayerStats.weeklyCompletion}%</span>
                    </div>
                    <Progress value={mockPrayerStats.weeklyCompletion} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    {mockPrayerStats.recentPrayers.slice(0, 3).map((prayer) => (
                      <div key={prayer.id} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{prayer.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{prayer.date}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Link href="/prayer-wall">
                    <Button variant="outline" className="w-full">
                      View Prayer Wall
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="strava" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {stravaStatus?.connected ? (
              <StravaReflectionDashboard eventId={1} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Strava + Prayer Integration
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Connect your Strava account to import activities and add prayer reflections
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">🏃‍♂️ Faith + Fitness Integration</h3>
                    <p className="text-sm text-blue-700">
                      Transform your Strava activities into opportunities for spiritual growth. Import your runs, 
                      add prayer reflections, and connect with a community that values both physical and spiritual wellness.
                    </p>
                    <ul className="text-sm text-blue-700 mt-3 space-y-1">
                      <li>• Import Strava activities with detailed metrics</li>
                      <li>• Add prayer reflections to your runs</li>
                      <li>• Share spiritual insights with the community</li>
                      <li>• Track both physical and spiritual progress</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Connect to Strava</h3>
                    <StravaConnect onStatusChange={setStravaStatus} />
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Discover Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{event.name}</h3>
                        <Badge variant={event.difficulty === "Beginner" ? "secondary" : "default"}>
                          {event.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {event.participants} joined
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/events/${event.id}`} className="flex-1">
                          <Button className="w-full">View Details</Button>
                        </Link>
                        <Button variant="outline">Quick Join</Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>My Current Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">#Glory Chasers - 100KM</h4>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>23.5 / 100 km</span>
                      </div>
                      <Progress value={23.5} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Days remaining: 32
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-yellow-800">First 10K!</h4>
                      <p className="text-sm text-yellow-600">Completed your first 10km run</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Heart className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-800">Prayer Warrior</h4>
                      <p className="text-sm text-blue-600">7-day prayer streak achieved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="prayers" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Prayer Streak</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{mockPrayerStats.streak}</div>
                <p className="text-muted-foreground">days in a row</p>
                <div className="mt-4 flex justify-center">
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < mockPrayerStats.streak ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Weekly Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">{mockPrayerStats.weeklyCompletion}%</div>
                  <p className="text-muted-foreground">completed</p>
                </div>
                <Progress value={mockPrayerStats.weeklyCompletion} className="h-3" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  6 of 7 days this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Total Prayers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{mockPrayerStats.totalPrayers}</div>
                <p className="text-muted-foreground">prayers shared</p>
                <Link href="/prayer-wall">
                  <Button variant="outline" className="w-full mt-4">
                    Add Prayer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Prayer Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPrayerStats.recentPrayers.map((prayer) => (
                  <div key={prayer.id} className="p-4 border rounded-lg">
                    <p className="mb-2">{prayer.content}</p>
                    <p className="text-sm text-muted-foreground">{prayer.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}