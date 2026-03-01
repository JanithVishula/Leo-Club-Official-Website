import { useEffect, useRef, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);
  const isRouteTransitioningRef = useRef(false);
  const brandPrefix = 'LEO CLUB OF';
  const hasExpectedPrefix = heroConfig.backgroundText.toUpperCase().startsWith(brandPrefix);
  const secondLineText = hasExpectedPrefix
    ? heroConfig.backgroundText.slice(brandPrefix.length).trim()
    : heroConfig.backgroundText;
  const hasHeroContent = !!heroConfig.backgroundText || !!heroConfig.heroImage || heroConfig.navLinks.length > 0;

  const handleRouteTransition = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    if (isRouteTransitioningRef.current) return;

    // If already on home page and clicking home link, scroll to top
    if (location.pathname === '/' && href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    isRouteTransitioningRef.current = true;

    gsap.to(sectionRef.current, {
      opacity: 0,
      y: -18,
      scale: 0.99,
      duration: 0.38,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate(href);
      },
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Store ScrollTrigger instances for cleanup
      const triggers: ScrollTrigger[] = [];

      // Parallax effect for main text
      const textTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (textRef.current) {
            gsap.set(textRef.current, { yPercent: self.progress * 50 });
          }
        },
      });
      triggers.push(textTrigger);

      // Parallax effect for model (slower movement = appears closer)
      const modelTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (modelRef.current) {
            gsap.set(modelRef.current, { yPercent: self.progress * 20 });
          }
        },
      });
      triggers.push(modelTrigger);

      // Fade out overlay text faster
      const overlayTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '30% top',
        scrub: 1,
        onUpdate: (self) => {
          if (overlayTextRef.current) {
            gsap.set(overlayTextRef.current, { opacity: 1 - self.progress });
          }
        },
      });
      triggers.push(overlayTrigger);

      // Cleanup function
      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!hasHeroContent) return null;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Layer 0: Background image */}
      {heroConfig.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroConfig.backgroundImage}
            alt={heroConfig.backgroundImageAlt || 'Background'}
            className="w-full h-full object-cover opacity-100"
            loading="eager"
          />
        </div>
      )}

      {/* Layer 1: Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 opacity-70" />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 2: Big Text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center z-10 will-change-transform"
      >
        <h1 className="text-[5.8vw] md:text-[6.6vw] lg:text-[7.2vw] font-sans font-extrabold text-white tracking-tight leading-none select-none text-center px-6">
          {hasExpectedPrefix ? (
            <>
              <span className="block">{brandPrefix}</span>
              <span className="block">{secondLineText}</span>
            </>
          ) : (
            heroConfig.backgroundText
          )}
        </h1>
      </div>

      {/* Layer 3: Hero Model Image (Cutout) */}
      {heroConfig.heroImage && (
        <div
          ref={modelRef}
          className="absolute inset-0 flex items-end justify-center z-20 will-change-transform"
        >
          <div className="relative w-[50vw] md:w-[35vw] lg:w-[28vw] max-w-[500px]">
            <img
              src={heroConfig.heroImage}
              alt={heroConfig.heroImageAlt}
              className="w-full h-auto object-contain"
              loading="eager"
            />
            {/* Gradient fade at bottom for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
        </div>
      )}

      {/* Layer 4: Overlay Text */}
      {heroConfig.overlayText && (
        <div
          ref={overlayTextRef}
          className="absolute bottom-[15%] right-[8%] md:right-[12%] z-30 will-change-transform"
        >
          <p className="font-serif italic text-xl md:text-2xl lg:text-3xl text-white/90 tracking-wide">
            {heroConfig.overlayText}
          </p>
        </div>
      )}

      {/* Navigation hint */}
      <nav className="absolute top-0 left-0 right-0 z-40 px-6 md:px-12 py-6 flex items-center justify-between">
        <a 
          href="/" 
          onClick={(event) => handleRouteTransition(event, '/')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <img 
            src="/Logo.png" 
            alt="Leo Club Logo" 
            className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="text-white font-sans font-bold text-xs md:text-sm tracking-tight group-hover:text-white/90 transition-colors duration-300">
            {heroConfig.brandName}
          </div>
        </a>
        {heroConfig.navLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-body">
            {heroConfig.navLinks.map((link) =>
              link.href.startsWith('/') ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(event) => handleRouteTransition(event, link.href)}
                  className="hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              ) : (
                <a key={link.label} href={link.href} className="hover:text-white transition-colors duration-300">
                  {link.label}
                </a>
              )
            )}
          </div>
        )}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </section>
  );
}
