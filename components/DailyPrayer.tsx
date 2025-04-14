"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const verseOfTheWeek = {
  title: "God's Glory Revealed: The Power of His Presence",
  prayer: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand. (Isaiah 41:10)",
  focus: "Meditate on God's promise to be with you and strengthen you in all circumstances."
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
            <p className="italic mb-4">{verseOfTheWeek.prayer}</p>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">{verseOfTheWeek.focus}</p>
            </div>
            <Link href="/verse-of-the-week" className="inline-block">
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
