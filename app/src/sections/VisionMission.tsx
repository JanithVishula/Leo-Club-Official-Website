import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Target } from 'lucide-react';
import { visionMissionConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            headingRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // Content cards animation
      const cards = contentRef.current?.querySelectorAll('.vision-mission-card');
      if (cards) {
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top 78%',
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.15,
              }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vision-mission"
      className="relative w-full py-24 md:py-32 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left Column - Heading */}
          <div ref={headingRef} className="opacity-0">
            {visionMissionConfig.subtitle && (
              <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-4">
                {visionMissionConfig.subtitle}
              </p>
            )}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight leading-tight">
              {visionMissionConfig.titleLine1}
              <br />
              <span className="font-serif italic font-normal text-white/80">
                {visionMissionConfig.titleLine2Italic}
              </span>
            </h2>
          </div>

          {/* Right Column - Vision & Mission Cards */}
          <div ref={contentRef} className="space-y-6">
            {/* Vision Card */}
            <div className="vision-mission-card group bg-gradient-to-br from-blue-900/40 to-slate-900/80 p-8 md:p-10 opacity-0 transition-all duration-500 hover:from-blue-800/50 hover:to-slate-800/90 cursor-pointer border border-white/5 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Eye className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-sans font-semibold text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                    {visionMissionConfig.visionTitle}
                  </h3>
                  <p className="text-base text-white/70 font-body leading-relaxed group-hover:text-white/85 transition-colors duration-300">
                    {visionMissionConfig.visionText}
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="vision-mission-card group bg-gradient-to-br from-purple-900/40 to-slate-900/80 p-8 md:p-10 opacity-0 transition-all duration-500 hover:from-purple-800/50 hover:to-slate-800/90 cursor-pointer border border-white/5 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Target className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-sans font-semibold text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                    {visionMissionConfig.missionTitle}
                  </h3>
                  <p className="text-base text-white/70 font-body leading-relaxed group-hover:text-white/85 transition-colors duration-300">
                    {visionMissionConfig.missionText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
