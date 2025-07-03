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
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  theme: string;
  description: string;
  image: string;
  youtubeUrl?: string;
  prayerGuide: PrayerGuide[];
  leaderboard: Runner[];
  prayers: Prayer[];
  participants: number;
  recentRuns?: RunSubmission[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock data (in a real app, this would come from an API/database)
// Function to get an event by ID
export function getEventById(id: string): Event | undefined {
  return events.find(event => event.id === id);
}

import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { getUser } from '@/lib/db/users';

export async function createEvent(newEvent: Partial<Omit<Event, 'id'>>): Promise<Event> {
  try {
    // Verify authentication and admin status
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to create events');
    }
    
    // Check if user is admin
    const userDoc = await getUser(auth.currentUser.uid);
    if (!userDoc?.isAdmin) {
      throw new Error('Only administrators can create events');
    }
    
    const eventData = {
      name: newEvent.name || 'New Event',
      startDate: newEvent.startDate || new Date().toISOString().split('T')[0],
      endDate: newEvent.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      theme: newEvent.theme || '',
      description: newEvent.description || '',
      image: newEvent.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    };

    // Get the auth token
    const token = await auth.currentUser.getIdToken();

    // Use the API endpoint to create the event
    const response = await fetch('/api/events/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    const createdEvent = await response.json();
    return createdEvent as Event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
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
    id: '1', 
    name: "#Glory Chasers - 100KM", 
    startDate: "2025-04-14",
    endDate: "2025-05-24",
    theme: "Unity in Diversity", 
    description: "#Glory Chasers 100km Challenge\nJoin the FCA East Global Conference's Glory Chasers challenge, a 40-day journey of faith, fitness, and fellowship!\nBe part of this inspiring journey, connecting with fellow FCA teammates and growing in faith together! Share your progress, experiences, and reflections with the community, and let's chase glory together!",
    image: "https://firebasestorage.googleapis.com/v0/b/kingdomrunnersdv1/o/tempimg%2FWhatsApp%20Image%202025-04-14%20at%204.54.17%20PM.jpeg?alt=media&token=17a282d4-3133-4a12-b9ec-a44723dfca73",
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
  }
];
