"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerseOfTheWeek() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">God's Glory Revealed: To Little Children</h1>
      <p className="text-muted-foreground mb-8">April 22, 2025</p>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">READY</h2>
          <blockquote className="italic border-l-4 border-primary pl-4 my-4">
            "At that time Jesus declared, 'I thank you, Father, Lord of heaven and earth, that You have hidden these things from the wise and understanding and revealed them to little children.'"
            <footer className="text-sm mt-2">Matthew 11:25 (ESV)</footer>
          </blockquote>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">SET</h2>
          <p>"I'll race you to the gate!" screamed Jeremiah, and off he scooted as fast as his little 6-year-old legs could take him.</p>
          <p>His dad, an elite athlete, easily kept up on his large kick bike but pretended to take great effort. "I'm catching up, you'd better go faster!"</p>
          <p>Jeremiah squealed with delight and redoubled his efforts. He loves racing with his dad. It takes all his heart, soul, mind, and strength.</p>
          <p>Like little children, we are so very limited in our ability to appreciate God's glory.</p>
          <p>Can we truly imagine His design and creativity—the One who called forth stars and far-flung galaxies, who filled our small planet with the stunning diversity of geologies, plants, birds, animals, and fish?</p>
          <p>Can we begin to grasp His power and majesty, as He directs the twists and turns of history, the rise and fall of nations by His sovereign will—over centuries and millennia—regardless of good or evil rulers?</p>
          <p>Do we really understand what it means to destroy death? 1 Corinthians 15:26 says, "The last enemy to be destroyed is death." Revelation 21:4 says, "He will wipe away every tear from their eyes, and death shall be no more."</p>
          <p>It's OK. He knows we're just His little children. So let's invite our heavenly Father into all our games and races—and we will experience His glory.</p>
          <p>Are there projects we're building? Ask for His help and blessing. Proverbs 16:3 says, "Commit your work to the Lord, and your plans will be established."</p>
          <p>Are there authorities in our lives we're struggling with—whether in families, workplaces, governments, or sports organizations? 1 Timothy 2:2 tells us to pray "for kings and all those in authority, that we may live peaceful and quiet lives in all godliness and holiness."</p>
          <p>Do we have friends or family members in need of healing—in body, mind, heart, or spirit? James 5:16 reminds us to "pray for one another, that you may be healed."</p>
          <p>How wonderful, how glorious, that the Lord of heaven and earth has made us His sons and daughters in Christ! As we pray to Him about everything, with thanksgiving, we experience His peace, His goodness, and His glory.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">GO</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>In what areas of life do you feel too "grown-up" to see God with childlike wonder?</li>
            <li>Have you invited God into your work, play, or relationships like a child inviting a dad into their world?</li>
            <li>What's one situation right now that you can simply bring to God with childlike faith and trust?</li>
            <li>Can you see glimpses of God's glory in the everyday? What would it take to notice them more?</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Additional Verses</h2>
          <ul className="space-y-2">
            <li>Philippians 4:4–7</li>
            <li>James 5:13–20</li>
            <li>Mark 9:23–24</li>
            <li>Galatians 4:6</li>
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
