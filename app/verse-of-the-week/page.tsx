"use client"

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VerseOfTheWeek() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">God's Glory Revealed: The Power of His Presence</h1>
        
        <div className="prose max-w-none">
          <blockquote className="text-2xl italic border-l-4 border-primary pl-4 my-6">
            “Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.”
            <footer className="text-lg mt-2">Isaiah 41:10</footer>
          </blockquote>

          <h2 className="text-2xl font-bold mt-8 mb-4">READY</h2>
          <p className="text-lg mb-6">
            There is something so profound when you encounter the presence of God.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">SET</h2>
          <p className="text-lg mb-4">
            It was June 14th, 2015, when I encountered the presence of the true, living God.
            On a bike trip across America, where we traveled from California to Maine over the course of 10 weeks, averaging 75 miles a day to total 4,000 miles across the country, I encountered Jesus personally and was changed forever.
          </p>
          <p className="text-lg mb-4">
            This specific day on June 14th, our team of about 30 woke up before 5am to crank out over 82 miles of biking in the hot state of Arizona.
            Little did I know that morning that God was going to show how He truly is "Immanuel," God with us.
          </p>

          {/* Continue with the rest of the article content */}
          <p className="text-lg mb-4">
            About every 20-25 miles on this bike trip, we had a rest stop where a support vehicle would provide water and food for us as we rode for hours each day.
            This ride, I wrote in my notebook, "was the hardest ride of my life—with over 6,000 feet in elevation gain and miles upon miles and serious heat."
          </p>

          {/* Include all remaining sections of the article */}

          <h2 className="text-2xl font-bold mt-8 mb-4">GO</h2>
          <p className="text-lg mb-4">
            Additional verses: Isaiah 55:1, John 7:37, John 4:13-14, Joshua 1:9, Matthew 1:23
          </p>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-4">Reflection Questions</h3>
            <ul className="space-y-4">
              <li>In what ways have you personally experienced God?</li>
              <li>How satisfied are you today physically, mentally, emotionally, spiritually?</li>
              <li>Do you have any "salt water" sources in your life that you are going to for satisfaction rather than the living waters of Jesus?</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
