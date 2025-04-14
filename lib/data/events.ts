export interface PrayerGuide {
  day: number;
  title: string;
  verse: string;
  prayer: string;
}

export interface Runner {
  id: number;
  name: string;
  country: string;
  distance: number;
  prayers: number;
}

export interface Prayer {
  id: number;
  runner: string;
  content: string;
  timestamp: string;
}

export interface RunSubmission {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  distance: number;
  duration: number;
  location: string;
  timestamp: Date;
  notes?: string;
}

export interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  theme: string;
  description: string;
  image: string;
  prayerGuide: PrayerGuide[];
  leaderboard: Runner[];
  prayers: Prayer[];
  participants: number;
  recentRuns?: RunSubmission[];
}

// Mock data (in a real app, this would come from an API/database)
// Function to get an event by ID
export function getEventById(id: number): Event | undefined {
  return events.find(event => event.id === id);
}

export function updateEvent(updatedEvent: Event): Promise<Event> {
  return new Promise((resolve, reject) => {
    try {
      const index = events.findIndex(e => e.id === updatedEvent.id);
      if (index === -1) {
        throw new Error('Event not found');
      }
      events[index] = updatedEvent;
      resolve(updatedEvent);
    } catch (error) {
      reject(error);
    }
  });
}

export const events: Event[] = [
  { 
    id: 1, 
    name: "FCA East Global Conference Hong Kong", 
    startDate: "2023-11-15",
    endDate: "2023-11-20",
    theme: "Unity in Diversity", 
    description: "#Glory Chasers 100km Challenge\nJoin the FCA East Global Conference's Glory Chasers challenge, a 40-day journey of faith, fitness, and fellowship!\nBe part of this inspiring journey, connecting with fellow FCA teammates and growing in faith together! Share your progress, experiences, and reflections with the community, and let's chase glory together!",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
    prayerGuide: [
      {
        day: 1,
        title: "Unity in Christ",
        verse: "Ephesians 4:3",
        prayer: "Pray for unity among runners across all nations, that we may encourage and uplift one another."
      },
      {
        day: 2,
        title: "Strength and Perseverance",
        verse: "Isaiah 40:31",
        prayer: "Ask for physical and spiritual strength as we run this race together."
      },
      {
        day: 3,
        title: "Global Impact",
        verse: "Matthew 5:16",
        prayer: "Pray that our running testimony would shine God's light to others."
      }
    ],
    leaderboard: [
      { id: 1, name: "Emma Johnson", country: "US", distance: 5.2, prayers: 12 },
      { id: 2, name: "Liu Wei", country: "CN", distance: 5.1, prayers: 8 },
      { id: 3, name: "Maria Garcia", country: "ES", distance: 5.0, prayers: 15 }
    ],
    prayers: [
      { id: 1, runner: "Emma Johnson", content: "Grateful for this global community of runners!", timestamp: "2023-11-15T10:00:00Z" },
      { id: 2, runner: "Liu Wei", content: "Praying for all participants to finish strong!", timestamp: "2023-11-15T11:30:00Z" }
    ],
    participants: 234
  },
  { 
    id: 2, 
    name: "Marathon of Hope", 
    startDate: "2023-12-01",
    endDate: "2023-12-15",
    theme: "Running for a Cause", 
    description: "A full marathon dedicated to raising awareness for global issues.",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80",
    prayerGuide: [],
    leaderboard: [],
    prayers: [],
    participants: 156
  },
  { 
    id: 3, 
    name: "New Year's Resolution Run", 
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    theme: "Fresh Starts", 
    description: "Start your year right with this motivational 10K run.",
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&q=80",
    prayerGuide: [],
    leaderboard: [],
    prayers: [],
    participants: 312
  }
];
