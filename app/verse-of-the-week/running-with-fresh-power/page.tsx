"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerseOfTheWeek() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">God's Glory Received: Running with Fresh Power</h1>
      <p className="text-muted-foreground mb-8">April 29, 2025</p>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">READY</h2>
          <blockquote className="italic border-l-4 border-primary pl-4 my-4">
            "Seek the LORD and His strength; seek His presence continually!"
            <footer className="text-sm mt-2">1 Chronicles 16:11 (ESV)</footer>
          </blockquote>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">SET</h2>
          <p>Imagine coming across this ad:</p>
          <p className="italic">"Are you tired of running and not seeing progress? Looking for a better edge and greater speed as an athlete?
          Free training coach! Sign up today—paid in full!
          This coach not only provides training, He also equips you with everything you need to succeed.
          Get ready to see incredible results as you follow His plan.
          Let's train together and get you to where you never imagined!"</p>

          <p>At one point in my life, I realized that training doesn't only happen while running.
          Nutrition, sleep, stretching, strength training, and recovery all played critical roles in the effectiveness of my training blocks.</p>

          <p>Likewise, as Christ-followers, running with fresh power requires focus in both physical and spiritual disciplines.
          Here's a breakdown of five key areas:</p>

          <h3 className="text-xl font-bold mt-6">Nutrition</h3>
          <p className="font-semibold">Physical:</p>
          <p>What you fuel your body with directly affects your performance.
          Choosing healthy, nutrient-rich foods is an investment that powers your training.</p>

          <p className="font-semibold">Spiritual:</p>
          <p>What are you feeding your soul?
          Jesus reminds us in Matthew 4:4:</p>
          <blockquote className="italic border-l-4 border-primary pl-4 my-4">
            "Man shall not live by bread alone, but by every word that comes from the mouth of God."
            <footer className="text-sm mt-2">Matthew 4:4</footer>
          </blockquote>
          <p>Beware of spiritual "junk food"—temporary fixes that leave your soul empty.
          Feed daily on God's Word for lasting strength.</p>

          <h3 className="text-xl font-bold mt-6">Sleep</h3>
          <p className="font-semibold">Physical:</p>
          <p>Good sleep habits are crucial for power, energy, and recovery.
          Is your phone—or something else—getting in the way of restful sleep?
          Guard your rest.</p>

          <p className="font-semibold">Spiritual:</p>
          <p>True rest comes from trusting in God's promises.
          Jesus has paid it all, so we can rest on the finished work of the cross.
          "Fear can keep us up all night, but faith makes one fine pillow."</p>

          <h3 className="text-xl font-bold mt-6">Stretching</h3>
          <p className="font-semibold">Physical:</p>
          <p>Stretching and foam rolling are essential for injury prevention and mobility.
          Don't skip this—tend to those tight spots.</p>

          <p className="font-semibold">Spiritual:</p>
          <p>A coach once said, "Blessed are the flexible, for they shall never be broken!"
          God often puts us in spiritually stretching situations to build flexibility in our faith. Lean into them.</p>

          <h3 className="text-xl font-bold mt-6">Strength Training</h3>
          <p className="font-semibold">Physical:</p>
          <p>Strong muscles are fast muscles.
          Strength training improves performance and prevents injury.</p>

          <p className="font-semibold">Spiritual:</p>
          <p>God strengthens us in His "weight room"—or sometimes in His "wait" room.
          Isaiah 40:31 reminds us:</p>
          <blockquote className="italic border-l-4 border-primary pl-4 my-4">
            "They who wait for the Lord shall renew their strength."
            <footer className="text-sm mt-2">Isaiah 40:31</footer>
          </blockquote>
          <p>James 1:2–4 teaches us to count it joy when we face trials because they build enduring strength for God's glory.</p>

          <h3 className="text-xl font-bold mt-6">Recovery</h3>
          <p className="font-semibold">Physical:</p>
          <p>Recovery is not optional—it's essential.
          Whether it's a recovery drink post-run or a full rest day each week, recovery boosts performance.</p>

          <p className="font-semibold">Spiritual:</p>
          <p>God designed us to rest.
          In a world driven by productivity, choosing to pause and be still before the Lord is powerful—and obedient.
          Ask Him what Sabbath rest can look like for you.
          Fresh power flows from rested hearts.</p>

          <p>Ultimately, every person must decide:
          Will you train on your own, or will you humble yourself and let the Lord be your Coach?</p>

          <p>He knows you best.
          He is for you—not against you.
          The cost of His training plan has been paid in full, but it still requires a daily decision to follow Him.</p>

          <p>When you choose His training, you won't just experience fresh power—you'll bring glory to Him and goodness to others around you.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">GO</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Have you ever felt the consequences of neglecting one of the five areas—physically or spiritually?</li>
            <li>Which area (Nutrition, Sleep, Stretching, Strength Training, or Recovery) do you most need to grow in right now?</li>
            <li>Is Jesus your Savior and your Lord? Are you listening to and following His training plan?</li>
            <li>Ask God: "Coach me today. Train me to run this race Your way."</li>
          </ul>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Additional verses for reflection:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Isaiah 41:10</li>
              <li>Proverbs 10:4</li>
              <li>John 8:31–32</li>
              <li>James 1:5</li>
            </ul>
          </div>
        </section>

        <div className="mt-8">
          <Link href="/verse-of-the-week">
            <Button>Back to Verse Archive</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
