import { Hero } from '../sections/Hero';
import { IntroGrid } from '../sections/IntroGrid';
import { VisionMission } from '../sections/VisionMission';
import { WhyChooseMe } from '../sections/WhyChooseMe';
import { AchievementsPreview } from '../sections/AchievementsPreview';
import { FeaturedProjects } from '../sections/FeaturedProjects';
import { Testimonials } from '../sections/Testimonials';
import { JoinMovementBanner } from '../sections/JoinMovementBanner';
import { FAQ } from '../sections/FAQ';
import { Footer } from '../sections/Footer';

export function HomePage() {
  return (
    <main className="page-enter relative w-full overflow-x-hidden">
      <Hero />
      <IntroGrid />
      <VisionMission />
      <WhyChooseMe />
      <FeaturedProjects />
      <AchievementsPreview />
      <Testimonials />
      <JoinMovementBanner />
      <FAQ />
      <Footer />
    </main>
  );
}
