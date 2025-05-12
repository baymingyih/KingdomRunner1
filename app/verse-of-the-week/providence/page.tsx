"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerseOfTheWeek() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">God's Glory Revealed: Providence</h1>
      <p className="text-muted-foreground mb-8">April 15, 2025</p>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">READY</h2>
          <blockquote className="italic border-l-4 border-primary pl-4 my-4">
            "And my God will meet all your needs according to the riches of His glory in Christ Jesus."
            <footer className="text-sm mt-2">Philippians 4:19</footer>
          </blockquote>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">SET</h2>
          <p>I love endurance. It speaks of faith—believing and trusting that God will provide the fuel, tenacity, and mental strength needed to finish what we start. Isn't that a beautiful reflection of how fitness and faith are intertwined in the life of an athlete?</p>

          <p>No matter how well I prepare for a half or full marathon, there are always variables beyond my control. Honestly, I'd be kidding myself if I claimed I could do it all on my own. God can allow unexpected conditions—a thunderstorm, a test of patience, or even physical strain—to remind me that He is the one who meets all my needs. And when race day comes, I've learned this truth: the only dependable source is God.</p>

          <p>I remember a 24-hour fundraising run I did last year, where God revealed His glory powerfully through His providence. The run was for a "fathering movement," and I felt a burden to gather a team of men who would represent the journey from manhood to fatherhood. One by one, God brought them: a single man, a couple without kids, young fathers, a grandfather, even a single dad. What a picture of God's intentional provision!</p>

          <p>Even the date was divinely appointed—it coincided with Yom Kippur, the Day of Atonement. While Jews around the world fasted 24hrs and prayed for forgiveness and healing, our team ran and prayed for restoration in families. That could only be God.</p>

          <p>I needed a venue, volunteers, sponsors—and God provided it all. More than that, He gave our team strength, grace, joy, and unity to run and pray through the 24 hours. We ended strong. That day reminded me of Jesus' final journey through Passion Week—how the Father provided all He needed to reach Calvary, except taking the cup away. And Jesus still declared, "It is finished" (John 19:30).</p>

          <p>God chooses when and how to reveal His glory. When He provides, He doesn't just meet a need—He reveals who He is. He did it with manna in the wilderness (Exodus 16), with a ram for Abraham (Genesis 22), with protection in the fiery furnace (Daniel 3), with a walk on water (Matthew 14), and in Paul's ministry needs (Philippians 4).</p>

          <p>His provision reveals His heart: love, mercy, power, and presence. Whether on or off the field, our needs—physical, emotional, mental, or spiritual—are known and met by our faithful Father. And when we experience His providence, we witness His glory.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">GO</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Who around you needs to hear about how God provided for you? Jot it down, pray for them and take action.</li>
            <li>What is a current "need" in your life that you've been trying to meet on your own?</li>
            <li>How has God revealed His glory through His provision in your past? Ask the Holy Spirit to reveal and draw strength from that altar.</li>
            <li>In what ways can you shift from self-reliance to full trust in His providence today?</li>
          </ul>
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
