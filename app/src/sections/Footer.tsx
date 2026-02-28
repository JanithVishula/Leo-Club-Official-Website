import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Facebook, Linkedin, Youtube, Mail, type LucideIcon } from 'lucide-react';
import { footerConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  YouTube: Youtube,
  Mail,
};

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contactEmail = footerConfig.email?.trim() ?? '';
  const hasFooterContent = !!footerConfig.logoText || !!contactEmail || footerConfig.navLinks.length > 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo — scale up + fade
      ScrollTrigger.create({
        trigger: logoRef.current,
        start: 'top 88%',
        onEnter: () => {
          gsap.fromTo(
            logoRef.current,
            { y: 80, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // Content — fade up
      ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 88%',
        onEnter: () => {
          gsap.fromTo(
            contentRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
          );
        },
        once: true,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  if (!hasFooterContent) return null;

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full bg-white pt-24 md:pt-32 pb-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Massive Logo */}
        {footerConfig.logoText && (
          <div ref={logoRef} className="opacity-0 mb-16 md:mb-24 text-center">
            <svg
              viewBox="0 0 1500 200"
              className="w-full md:w-[80%] h-auto max-h-[18vh] mx-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="fill-softblack font-sans font-extrabold"
                style={{
                  fontSize: '58px',
                  letterSpacing: '-0.03em',
                }}
              >
                {footerConfig.logoText}
              </text>
            </svg>
          </div>
        )}

        {/* Footer Content */}
        <div ref={contentRef} className="opacity-0">
          <div className="grid md:grid-cols-3 gap-12 md:gap-1000 mb-16">
            {/* Contact Info */}
            <div className="space-y-4 md:pr-6">
              {footerConfig.contactLabel && (
                <p className="text-softblack/50 text-sm font-body uppercase tracking-widest mb-4">
                  {footerConfig.contactLabel}
                </p>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="block text-base md:text-lg leading-tight whitespace-nowrap font-sans font-semibold text-softblack hover:text-softblack/70 transition-colors duration-300"
                >
                  {contactEmail}
                </a>
              )}
              {footerConfig.locationText && (
                <p className="text-softblack/60 font-body text-base leading-relaxed whitespace-pre-line">
                  {footerConfig.locationText}
                </p>
              )}
            </div>

            {/* Navigation */}
            {footerConfig.navLinks.length > 0 && (
              <div>
                {footerConfig.navigationLabel && (
                  <p className="text-softblack/50 text-sm font-body uppercase tracking-widest mb-4">
                    {footerConfig.navigationLabel}
                  </p>
                )}
                <nav className="space-y-3">
                  {footerConfig.navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-softblack/80 hover:text-softblack font-body transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Social Links */}
            <div>
              {footerConfig.socialLabel && (
                <p className="text-softblack/50 text-sm font-body uppercase tracking-widest mb-4">
                  {footerConfig.socialLabel}
                </p>
              )}
              {footerConfig.socialLinks.length > 0 && (
                <div className="flex items-center gap-4">
                  {footerConfig.socialLinks.map((social) => {
                    const Icon = iconMap[social.iconName] || Mail;
                    const isWebLink = social.href.startsWith('http');
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        target={isWebLink ? '_blank' : undefined}
                        rel={isWebLink ? 'noopener noreferrer' : undefined}
                        className="w-10 h-10 rounded-full bg-offwhite flex items-center justify-center text-softblack/70 hover:bg-blue-950 hover:text-white transition-all duration-300"
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </a>
                    );
                  })}
                </div>
              )}
              {footerConfig.tagline && (
                <p className="mt-6 text-softblack/40 font-body text-sm whitespace-pre-line">
                  {footerConfig.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-softblack/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-softblack/40 font-body text-sm">
              {footerConfig.copyright || `\u00A9 ${new Date().getFullYear()} All rights reserved.`}
            </p>
            {footerConfig.bottomLinks.length > 0 && (
              <div className="flex items-center gap-6 text-softblack/40 font-body text-sm">
                {footerConfig.bottomLinks.map((link) => (
                  <a key={link.label} href={link.href} className="hover:text-softblack transition-colors duration-300">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-offwhite to-transparent pointer-events-none" />
    </footer>
  );
}
