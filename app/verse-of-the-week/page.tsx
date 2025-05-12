"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { verses, parseVerseDate } from './verses';

export default function VerseOfTheWeek() {
  // Sort verses by date (newest first)
  const sortedVerses = [...verses].sort((a, b) => 
    parseVerseDate(b.date).getTime() - parseVerseDate(a.date).getTime()
  );
  const currentVerse = sortedVerses[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Current Verse Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4 text-center">Current Verse of the Week</h1>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{currentVerse.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentVerse.date}</p>
          </CardHeader>
          <CardContent>
            <blockquote className="italic border-l-4 border-primary pl-4 my-4 text-lg">
              {currentVerse.verse}
              <footer className="text-sm mt-2">{currentVerse.reference}</footer>
            </blockquote>
            <div className="mt-4">
              <Link href={`/verse-of-the-week/${currentVerse.id}`}>
                <Button className="w-full flex items-center justify-center gap-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                  Read Full Article <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verse Archive */}
      <h2 className="text-2xl font-bold mb-8 text-center">Verse Archive</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {sortedVerses.map((verse) => (
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
