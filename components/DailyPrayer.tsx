"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { verses, parseVerseDate } from '@/app/verse-of-the-week/verses';

// Get current verse (most recent by date)
const currentVerse = [...verses].sort((a, b) => 
  parseVerseDate(b.date).getTime() - parseVerseDate(a.date).getTime()
)[0];

const verseOfTheWeek = {
  title: currentVerse.title,
  prayer: `"${currentVerse.verse}"`,
  verseRef: currentVerse.reference,
  focus: `Meditate on ${currentVerse.reference.split(' ')[0]}'s message for this week`
};

export default function DailyPrayer() {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Verse of the Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="px-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">{verseOfTheWeek.title}</h3>
            <blockquote className="italic mb-4 text-lg">
              {verseOfTheWeek.prayer}
              <footer className="text-base mt-2">{verseOfTheWeek.verseRef}</footer>
            </blockquote>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">{verseOfTheWeek.focus}</p>
            </div>
            <Link href={`/verse-of-the-week/${currentVerse.id}`} className="inline-block">
              <Button variant="outline" className="w-full">
                Read Full Article
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
