"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const verseOfTheWeek = {
  title: "God's Glory Revealed: Running on Tired Legs",
  prayer: `"But those who hope in the Lord will renew their strength.
They will soar on wings like eagles;
they will run and not grow weary,
they will walk and not be faint."`,
  verseRef: "Isaiah 40:31",
  focus: "Trust in God's promise to renew your strength when you feel weary."
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
            <Link href="/verse-of-the-week/running-on-tired-legs" className="inline-block">
              <Button className={buttonVariants({ variant: 'outline' }) + " w-full"}>
                Read Full Article
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
