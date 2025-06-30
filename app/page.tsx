import Hero from '@/components/Hero';
import DailyPrayer from '@/components/DailyPrayer';
import FeaturedEvents from '@/components/FeaturedEvents';
import { RunGuide } from '@/components/runs/RunGuide';
import HomeSocialSection from '@/components/home/HomeSocialSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4">
        <FeaturedEvents />
        <HomeSocialSection />
        <DailyPrayer />
        <RunGuide />
      </div>
    </main>
  );
}
