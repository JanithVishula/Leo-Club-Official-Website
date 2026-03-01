// Site Configuration
// Leo Club of Pannipitiya Paradise

export interface SiteConfig {
  language: string;
  siteTitle: string;
  siteDescription: string;
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Leo Club of Pannipitiya Paradise",
  siteDescription: "Youth leadership and community service organization dedicated to making a positive impact in Pannipitiya and beyond.",
};

// Hero Section
export interface HeroConfig {
  backgroundText: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  heroImage: string;
  heroImageAlt: string;
  overlayText: string;
  brandName: string;
  navLinks: { label: string; href: string }[];
}

export const heroConfig: HeroConfig = {
  backgroundText: "LEO CLUB OF PANNIPITIYA PARADISE",
  backgroundImage: "/wide-impact.jpg",
  backgroundImageAlt: "Leo Club background",
  heroImage: "/Hero-leo.jpg",
  heroImageAlt: "Leo Club Member",
  overlayText: "LEAD WITH HEART – WALK AS ONE",
  brandName: "Leo Club of Pannipitiya Paradise",
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "/about" },
    { label: "Projects & Services", href: "/projects" },
    { label: "Board Members", href: "/board-members" },
    { label: "Achievements", href: "/awards-achievements" },
    { label: "Join Us", href: "/join-the-movement" },
    { label: "Contact", href: "#footer" },
  ],
};

// Intro Grid Section
export interface PortfolioImage {
  src: string;
  alt: string;
}

export interface IntroGridConfig {
  titleLine1: string;
  titleLine2: string;
  description: string;
  portfolioImages: PortfolioImage[];
  accentText: string;
}

export const introGridConfig: IntroGridConfig = {
  titleLine1: "Empowering Youth",
  titleLine2: "Transforming Communities",
  description: "Leo Club of Pannipitiya Paradise is a dynamic youth organization committed to developing leadership skills while serving our community. Through meaningful projects and collaborative efforts, we create lasting positive change.",
  portfolioImages: [
    { src: "/gallery-1.jpg", alt: "Community Service Project" },
    { src: "/gallery-2.jpg", alt: "Youth Leadership Workshop" },
    { src: "/gallery-3.jpg", alt: "Environmental Initiative" },
    { src: "/gallery-4.jpg", alt: "Charity Event" },
    { src: "/gallery-5.jpg", alt: "Team Building Activity" },
  ],
  accentText: "Active Since 2023 - Pannipitiya, Sri Lanka",
};

// Featured Projects Section - Types Only (Data from Supabase)
export interface Project {
  id: string;
  title: string;
  dateText: string;
  imageUrl: string;
  description: string;
  category?: string;
  galleryImages?: string[];
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface FeaturedProjectsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  viewAllText: string;
  viewAllHref: string;
  viewProjectText: string;
}

export const featuredProjectsConfig: FeaturedProjectsConfig = {
  subtitle: "Our Initiatives",
  titleRegular: "Key",
  titleItalic: "Projects",
  viewAllText: "Read More",
  viewAllHref: "/projects",
  viewProjectText: "Read More",
};

// Vision & Mission Section
export interface VisionMissionConfig {
  subtitle: string;
  titleLine1: string;
  titleLine2Italic: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
}

export const visionMissionConfig: VisionMissionConfig = {
  subtitle: "Our Purpose",
  titleLine1: "Vision &",
  titleLine2Italic: "Mission",
  visionTitle: "Our Vision",
  visionText: "To empower young leaders who create positive change in their communities, fostering a culture of service, compassion, and excellence that inspires generations to come.",
  missionTitle: "Our Mission",
  missionText: "We are committed to developing the leadership potential of youth through meaningful community service projects, collaborative partnerships, and transformative experiences that build character, strengthen communities, and create lasting impact.",
};

// Why Choose Me Section
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface FeatureCard {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface WhyChooseMeConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  statsLabel: string;
  stats: StatItem[];
  featureCards: FeatureCard[];
  wideImage: string;
  wideImageAlt: string;
  wideTitle: string;
  wideDescription: string;
}

export const whyChooseMeConfig: WhyChooseMeConfig = {
  subtitle: "Our Impact",
  titleRegular: "Making a",
  titleItalic: "Difference",
  statsLabel: "By The Numbers",
  stats: [
    { value: 60, suffix: "+", label: "Active Members" },
    { value: 50, suffix: "+", label: "Projects Completed" },
    { value: 5000, suffix: "+", label: "Lives Impacted" },
    { value: 3, suffix: "", label: "Years of Service" },
  ],
  featureCards: [
    {
      image: "static images/feature-1.jpg",
      imageAlt: "Team Collaboration",
      title: "Strong Team Spirit",
      description: "Our members work together with passion and dedication, creating a supportive environment where everyone can contribute and grow.",
    },
    {
      image: "static images/feature-2.jpg",
      imageAlt: "Community Engagement",
      title: "Community First",
      description: "Every project we undertake is designed with the community's needs at heart, ensuring meaningful and sustainable impact.",
    },
  ],
  wideImage: "/wide-impact.jpg",
  wideImageAlt: "Community Impact",
  wideTitle: "Join the Movement",
  wideDescription: "Be part of a global network of young leaders making a difference. Together, we can create the change we want to see in our world.",
};

// Testimonials Section - Types Only (Data from Supabase)
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  quote: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface TestimonialsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
}

export const testimonialsConfig: TestimonialsConfig = {
  subtitle: "Member Stories",
  titleRegular: "Voices from Our",
  titleItalic: "Community",
};

// FAQ Section - Types Only (Data from Supabase)
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  ctaText: string;
  ctaButtonText: string;
  ctaHref: string;
}

export const faqConfig: FAQConfig = {
  subtitle: "Common Questions",
  titleRegular: "Frequently Asked",
  titleItalic: "Questions",
  ctaText: "Still have questions?",
  ctaButtonText: "Contact Us",
  ctaHref: "#footer",
};

// Board Members Page - Types Only (Data from Supabase)
export interface BoardMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  bio: string | null;
  email: string | null;
  linkedin: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface BoardMembersConfig {
  subtitle: string;
  title: string;
}

export const boardMembersConfig: BoardMembersConfig = {
  subtitle: "Leoistic Year 2025/26",
  title: "Board Members",
};

// Awards & Achievements Page - Types Only (Data from Supabase)
export interface Achievement {
  id: string;
  category: 'project' | 'individual' | 'special';
  title: string;
  details: string[];
  imageUrl: string | null;
  imageAlt: string | null;
  displayOrder: number;
}

export interface AchievementsConfig {
  subtitle: string;
  title: string;
}

export const achievementsConfig: AchievementsConfig = {
  subtitle: "Recognition & Excellence",
  title: "Awards and Achievements",
};

// Footer Section
export interface SocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  logoText: string;
  contactLabel: string;
  email: string;
  locationText: string;
  navigationLabel: string;
  navLinks: FooterLink[];
  socialLabel: string;
  socialLinks: SocialLink[];
  tagline: string;
  copyright: string;
  bottomLinks: FooterLink[];
}

export const footerConfig: FooterConfig = {
  logoText: "Leadership - Experience - Opportunity",
  contactLabel: "Get in Touch",
  email: "leoclub.pannipitiyaparadise@gmail.com",
  locationText: "Pannipitiya,\nColombo District,\nSri Lanka",
  navigationLabel: "Quick Links",
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "/about" },
    { label: "Our Projects", href: "#projects" },
    { label: "Vision & Mission", href: "#vision-mission" },
    { label: "Impact", href: "#impact" },
    { label: "FAQ", href: "#faq" },
  ],
  socialLabel: "Follow Us",
  socialLinks: [
    { iconName: "Facebook", href: "https://web.facebook.com/profile.php?id=100093667850763", label: "Facebook" },
    { iconName: "Instagram", href: "https://www.instagram.com/paradise_leos?igsh=MzdydTIyMWU3OXcy", label: "Instagram" },
    { iconName: "YouTube", href: "https://youtube.com/@leoclubofpannipitiyaparadise?si=bq3-VsXsYqEC6tyu", label: "YouTube" },
    { iconName: "Linkedin", href: "https://www.linkedin.com/company/leo-club-of-pannipitiyaparadise/", label: "LinkedIn" },
  ],
  tagline: "Serving with Pride\nLeading with Heart",
  copyright: "© 2026 Leo Club of Pannipitiya Paradise. All rights reserved.",
  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};
