import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whyChooseMeConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function JoinMovementBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.set(bannerRef.current, { opacity: 1 });

          gsap.fromTo(
            bannerRef.current,
            { clipPath: 'inset(12% 4% 12% 4%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.2,
              ease: 'power4.inOut',
            }
          );

          gsap.fromTo(
            contentRef.current,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.4 }
          );
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!whyChooseMeConfig.wideImage) return null;

  return (
    <section ref={sectionRef} className="w-full bg-white pt-8 md:pt-12 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div ref={bannerRef} className="relative rounded-lg overflow-hidden group opacity-0">
          <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden">
            <img
              src={whyChooseMeConfig.wideImage}
              alt={whyChooseMeConfig.wideImageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-blue-950/20 to-transparent" />

          <div ref={contentRef} className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 max-w-xl opacity-0">
            {whyChooseMeConfig.wideTitle && (
              <h2 className="text-white font-sans font-bold text-2xl md:text-3xl mb-3 tracking-tight">
                {whyChooseMeConfig.wideTitle}
              </h2>
            )}
            {whyChooseMeConfig.wideDescription && (
              <p className="text-white/85 font-body text-sm md:text-base mb-5 leading-relaxed">
                {whyChooseMeConfig.wideDescription}
              </p>
            )}
            <Link
              to="/join-the-movement"
              className="inline-flex items-center gap-2 rounded-md bg-white text-blue-950 px-4 py-2 font-body text-sm font-semibold hover:bg-white/90 transition-colors duration-300"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
