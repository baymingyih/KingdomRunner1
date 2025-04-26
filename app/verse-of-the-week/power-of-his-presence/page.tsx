"use client"

import { VerseCard } from '@/components/VerseCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PowerOfHisPresenceVerse() {
  return (
    <div className="container mx-auto px-4 py-8">
      <VerseCard
        title="God's Glory Revealed: The Power of His Presence"
        verse="Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand."
        verseRef="Isaiah 41:10"
        readyContent="There is something so profound when you encounter the presence of God."
        setContent="<p className='text-lg mb-4'>It was June 14th, 2015, when I encountered the presence of the true, living God. On a bike trip across America, where we traveled from California to Maine over the course of 10 weeks, averaging 75 miles a day to total 4,000 miles across the country, I encountered Jesus personally and was changed forever.</p><p className='text-lg mb-4'>This specific day on June 14th, our team of about 30 woke up before 5am to crank out over 82 miles of biking in the hot state of Arizona. Little did I know that morning that God was going to show how He truly is &quot;Immanuel,&quot; God with us.</p><p className='text-lg mb-4'>About every 20-25 miles on this bike trip, we had a rest stop where a support vehicle would provide water and food for us as we rode for hours each day. This ride, I wrote in my notebook, &quot;was the hardest ride of my life—with over 6,000 feet in elevation gain and miles upon miles and serious heat.&quot;</p>"
        goContent="<p className='mb-4'>Additional verses: Isaiah 55:1, John 7:37, John 4:13-14, Joshua 1:9, Matthew 1:23</p>"
        reflectionQuestions={[
          "In what ways have you personally experienced God?",
          "How satisfied are you today physically, mentally, emotionally, spiritually?",
          "Do you have any \"salt water\" sources in your life that you are going to for satisfaction rather than the living waters of Jesus?"
        ]}
      />

      <div className="mt-8">
        <Link href="/verse-of-the-week">
          <Button>Back to Verse Archive</Button>
        </Link>
      </div>
    </div>
  );
}
