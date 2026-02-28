import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { achievementsConfig } from '../config';
import { listAchievementsPublic, type CmsAchievementRecord } from '../lib/cmsApi';

gsap.registerPlugin(ScrollTrigger);

export function AchievementsPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      if (cards) {
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.set(cards, { opacity: 1 });
            gsap.fromTo(
              cards,
              { y: 34, clipPath: 'inset(10% 4% 10% 4%)' },
              {
                y: 0,
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
  }, []);

  const [remoteAchievements, setRemoteAchievements] = useState<CmsAchievementRecord[]>([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const rows = await listAchievementsPublic();
      if (rows.length) {
        setRemoteAchievements(rows);
      }
    };

    loadAchievements();
  }, []);

  const projectAchievements = remoteAchievements.filter((item) => item.category === 'project');
  const specialAchievement = remoteAchievements.find((item) => item.category === 'special');

  const cardOneTitle = projectAchievements[0]?.title || achievementsConfig.projectAwards[0]?.title || 'Award Image 01';
  const cardOneCaption = projectAchievements[0]?.details[0] || achievementsConfig.projectAwards[0]?.details[0] || 'Add your first award image and highlight here.';
  const cardOneImage = projectAchievements[0]?.imageUrl || achievementsConfig.projectAwards[0]?.image || '';
  const cardOneAlt = projectAchievements[0]?.imageAlt || achievementsConfig.projectAwards[0]?.imageAlt || 'Award highlight 01';

  const cardTwoTitle = projectAchievements[1]?.title || achievementsConfig.projectAwards[1]?.title || 'Award Image 02';
  const cardTwoCaption = projectAchievements[1]?.details[0] || achievementsConfig.projectAwards[1]?.details[0] || 'Add your second award image and highlight here.';
  const cardTwoImage = projectAchievements[1]?.imageUrl || achievementsConfig.projectAwards[1]?.image || '';
  const cardTwoAlt = projectAchievements[1]?.imageAlt || achievementsConfig.projectAwards[1]?.imageAlt || 'Award highlight 02';

  const specialCaption = specialAchievement?.details[0] || specialAchievement?.title || achievementsConfig.specialRecognition || 'Add your third award image and highlight here.';
  const specialImage = specialAchievement?.imageUrl || '';
  const specialAlt = specialAchievement?.imageAlt || 'Special recognition highlight';

  const awardCards = [
    {
      title: cardOneTitle,
      caption: cardOneCaption,
      image: cardOneImage,
      imageAlt: cardOneAlt,
      sizeClass: 'md:col-span-3 md:row-span-2',
    },
    {
      title: cardTwoTitle,
      caption: cardTwoCaption,
      image: cardTwoImage,
      imageAlt: cardTwoAlt,
      sizeClass: 'md:col-span-3 md:row-span-1 md:col-start-4 md:row-start-1',
    },
    {
      title: 'Special Recognition',
      caption: specialCaption,
      image: specialImage,
      imageAlt: specialAlt,
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
          {awardCards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className={`award-card relative overflow-hidden rounded-lg opacity-0 ${card.sizeClass}`}
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
          ))}
        </div>
      </div>
    </section>
  );
}
