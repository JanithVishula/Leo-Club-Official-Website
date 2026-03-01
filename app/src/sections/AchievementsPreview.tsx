import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { achievementsConfig } from '../config';
import { listHomepageFeaturedAchievements, type CmsAchievementRecord } from '../lib/cmsApi';

gsap.registerPlugin(ScrollTrigger);

export function AchievementsPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [featuredAchievements, setFeaturedAchievements] = useState<CmsAchievementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const rows = await listHomepageFeaturedAchievements();
        setFeaturedAchievements(rows);
      } catch (error) {
        console.error('Error loading featured achievements:', error);
        setFeaturedAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  // Setup GSAP animations after achievements load
  useEffect(() => {
    if (loading) return; // Wait for data to load

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            headerRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
          );
        },
        once: true,
      });

      const cards = gridRef.current?.querySelectorAll('.award-card');
      if (cards && cards.length > 0) {
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 34, opacity: 0, clipPath: 'inset(10% 4% 10% 4%)' },
              {
                y: 0,
                opacity: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1,
                ease: 'power3.out',
                stagger: 0.12,
              }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, featuredAchievements.length]);

  // Build award cards from featured achievements (only show what's actually featured)
  const awardCards = featuredAchievements.length > 0 
    ? featuredAchievements.map((achievement, index) => ({
        title: achievement.title,
        caption: (achievement.details && achievement.details.length > 0)
          ? achievement.details.join(' • ')
          : 'Award highlight',
        image: achievement.imageUrl || '',
        imageAlt: achievement.imageAlt || `${achievement.title} award`,
        sizeClass: index === 0 
          ? 'md:col-span-3 md:row-span-2' 
          : index === 1
          ? 'md:col-span-3 md:row-span-1 md:col-start-4 md:row-start-1'
          : 'md:col-span-2 md:row-span-1 md:col-start-4 md:row-start-2',
      }))
    : [
        {
          title: achievementsConfig.projectAwards[0]?.title || 'Award Image 01',
          caption: achievementsConfig.projectAwards[0]?.details[0] || 'Add achievements in admin panel',
          image: achievementsConfig.projectAwards[0]?.image || '',
          imageAlt: achievementsConfig.projectAwards[0]?.imageAlt || 'Award highlight 01',
          sizeClass: 'md:col-span-3 md:row-span-2',
        },
        {
          title: achievementsConfig.projectAwards[1]?.title || 'Award Image 02',
          caption: achievementsConfig.projectAwards[1]?.details[0] || 'Add achievements in admin panel',
          image: achievementsConfig.projectAwards[1]?.image || '',
          imageAlt: achievementsConfig.projectAwards[1]?.imageAlt || 'Award highlight 02',
          sizeClass: 'md:col-span-3 md:row-span-1 md:col-start-4 md:row-start-1',
        },
        {
          title: 'Special Recognition',
          caption: achievementsConfig.specialRecognition || 'Add achievements in admin panel',
          image: '',
          imageAlt: 'Special recognition highlight',
          sizeClass: 'md:col-span-2 md:row-span-1 md:col-start-4 md:row-start-2',
        },
      ];

  return (
    <section ref={sectionRef} className="w-full bg-white pt-12 md:pt-16 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div ref={headerRef} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <p className="text-softblack/50 text-xs font-body uppercase tracking-widest mb-2">Achievements</p>
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-softblack tracking-tight">
              Awards <span className="font-serif italic font-normal text-softblack/70">& Recognition</span>
            </h2>
          </div>
          <Link
            to="/awards-achievements"
            className="inline-flex items-center gap-2 text-softblack/70 hover:text-softblack font-body text-sm transition-colors duration-300"
          >
            View All Achievements
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-6 auto-rows-[180px] md:auto-rows-[190px] gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-softblack/50 text-sm">Loading achievements...</p>
            </div>
          ) : awardCards.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <p className="text-softblack/70 text-sm mb-2">No featured achievements yet</p>
              <p className="text-softblack/50 text-xs">Add achievements from the admin panel</p>
            </div>
          ) : (
            awardCards.map((card, index) => (
              <article
                key={`${card.title}-${index}`}
                className={`award-card relative overflow-hidden rounded-lg ${card.sizeClass}`}
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-white to-softblack/10" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-softblack/75 via-softblack/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/75 font-body mb-1">Award Highlight</p>
                  <h3 className="font-sans font-semibold text-sm md:text-base leading-tight">{card.title}</h3>
                  <p className="font-body text-xs md:text-sm text-white/85 mt-2 line-clamp-3">{card.caption}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
