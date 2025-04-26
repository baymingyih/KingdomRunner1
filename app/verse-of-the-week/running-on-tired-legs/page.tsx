"use client"

import { VerseCard } from '@/components/VerseCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RunningOnTiredLegsVerse() {
  return (
    <div className="container mx-auto px-4 py-8">
      <VerseCard
        title="God's Glory Revealed: Running on Tired Legs"
        verse="But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."
        verseRef="Isaiah 40:31"
        readyContent="But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint. Isaiah 40:31"
        setContent="<p className='text-lg mb-4'>I've been training for an ultra-marathon for the past few months. The training went well—I didn't miss a single workout my coach planned, week after week. Leading up to race day, everything felt good. My body was cooperating. I had tapered properly. I carb-loaded well. I felt 100% ready for the challenge ahead.</p><p className='text-lg mb-4'>The night before the race, runners in the community were exchanging encouragement. One of them quoted Isaiah 40:31—the very verse I've used for this devotion. It resonated deeply.</p><p className='text-lg mb-4'>On race day, things started smoothly. I woke up on time, got ready, and arrived at the venue without a hitch. My pacing strategy was loaded onto my Garmin watch, just as planned. I was prepared to enjoy the race and glorify God through my effort.</p><p className='text-lg mb-4'>The race began. The cool morning breeze brushed my face. The cheers from the crowd lifted my spirit. It truly felt like the perfect day.</p><p className='text-lg mb-4'>Then came 18KM. A blister started forming on my right big toe. I tried to adjust my foot strike to manage the pain. At 43KM, the first signs of muscle cramping set in. From that point on, the cramps came more frequently and slowed me down. The pain in my toe intensified, and the cramping in my legs became unbearable. My body was on the verge of collapse.</p><p className='text-lg mb-4'>At the 45KM mark, I cried out to God to take over. I told Him I had no legs left to carry me to the 56KM finish line. This day had been covered in prayer—by me and many others. It was now time for God to glorify Himself.</p><p className='text-lg mb-4'>As I lay on the physio table, getting massaged while precious time ticked away, the verse from Isaiah echoed once more in my heart. While I had my own plans for how the race would go, God was revealing His glory in a different way.</p><p className='text-lg mb-4'>Eventually, I crossed the finish line—within my target time. But I know it wasn't my strength that got me there. I had been carried by the Spirit of God. At 43KM, my weary body met His divine power. The moments on the physio table became sacred pauses—opportunities to wait on the Lord—even when it felt like I was losing time. He renewed my strength. He revealed His glory. And I finished the race, not on my own legs, but by His power.</p>"
        goContent="<p className='mb-4'>How can you invite God into these weary moments and allow Him to glorify Himself through your weakness?</p><p className='mb-4'>Are you in a season where it feels like time is running out on you?</p><p className='mb-4'>Are the expectations of life and others wearing you down so much that you feel you can't keep running your race?</p>"
        reflectionQuestions={[
          "How do you typically respond when you reach the end of your strength?",
          "In what areas of your life do you need God's strength right now?",
          "How can you practice 'waiting on the Lord' in your daily life?"
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
