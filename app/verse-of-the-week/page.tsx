"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const verses = [
  {
    id: "running-on-tired-legs",
    title: "God's Glory Revealed: Running on Tired Legs",
    verse: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
    date: "April 8, 2025"
  },
  {
    id: "power-of-his-presence",
    title: "God's Glory Revealed: The Power of His Presence",
    verse: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.",
    reference: "Isaiah 41:10",
    date: "April 1, 2025"
  }
];

export default function VerseOfTheWeek() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Verse of the Week Archive</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {verses.map((verse) => (
          <Card key={verse.id} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>{verse.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{verse.date}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <blockquote className="italic border-l-4 border-primary pl-4 my-4">
                {verse.verse}
                <footer className="text-sm mt-2">{verse.reference}</footer>
              </blockquote>
              <div className="mt-4">
                <Link href={`/verse-of-the-week/${verse.id}`}>
                  <Button className="w-full flex items-center justify-center gap-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
