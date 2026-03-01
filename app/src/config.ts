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
    { label: "About", href: "#intro" },
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

// Featured Projects Section
export interface Project {
  id: number;
  title: string;
  date: string;
  image: string;
  description: string;
  ctaText: string;
  href: string;
  category?: string;
  galleryImages?: string[];
}

export interface FeaturedProjectsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  viewAllText: string;
  viewAllHref: string;
  viewProjectText: string;
  projects: Project[];
}

export const featuredProjectsConfig: FeaturedProjectsConfig = {
  subtitle: "Our Initiatives",
  titleRegular: "Key",
  titleItalic: "Projects",
  viewAllText: "Read More",
  viewAllHref: "/projects",
  viewProjectText: "Read More",
  projects: [
    {
      id: 0,
      title: "Sadaham Puja",
      date: "10/07/2025",
      category: "Community",
      description:
        "A peaceful religious & cultural service project with community participation.",
      ctaText: "More",
      href: "#",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja01.jpeg",
      galleryImages: [
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja01.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja02.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja03.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja04.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja05.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja06.jpeg",
      ],
    },
    {
      id: 1,
      title: "Senehe Piruna Pitu",
      date: "06/09/2025",
      category: "Education",
      description:
        "Supporting underprivileged students by donating 1,000 CR books (120 pages).",
      ctaText: "More",
      href: "#",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509090025441359396179.jpeg",
      galleryImages: [
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509090025441359396179.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/20250909114736638600007.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/20250909114833543531545.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509091153241455692918.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509091154452002035646.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092045521903323878.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092046391837341903.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/20251009204731781330478.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092107132468342.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092108021794907401.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092111141808225620.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092111311643513280.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092112051064708016.jpeg",
      ],
    },
    {
      id: 2,
      title: "ELITE 25 Installation Ceremony",
      date: "20/09/2025",
      category: "Leadership",
      description:
        "Formal installation ceremony of Leo Club ELITE 25 with leadership transition and recognition of outgoing members.",
      ctaText: "More",
      href: "#",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/hero-image.jpeg",
      galleryImages: [
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/hero-image.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251006142358729209400.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251006142438199798937.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251006142517328323101.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/202510061426051118596416.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/202510092040312028265676.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/202510092041142048999142.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251009204436256080095.jpeg",
      ],
    },
    {
      id: 3,
      title: "International Tree Plantation Drive",
      date: "22/11/2025",
      category: "Environment",
      description:
        "International tree planting initiative supporting reforestation and environmental awareness across multiple Leo clubs.",
      ctaText: "More",
      href: "#",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122006121190925964.jpeg",
      galleryImages: [
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122006121190925964.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112200737899589340.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122009211639179907.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122009391941820572.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112201117146957406.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122011471161910028.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122012131307866075.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122013451441891787.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112201435665349504.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112201535441753713.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601152202091996883195.jpeg",
      ],
    },
    {
      id: 4,
      title: "Paradisaye Sahurda Yathra Flood Relief",
      date: "21/12/2025",
      category: "Community",
      description:
        "Flood relief donation drive supporting Sirasa Sahana Yathra to aid affected communities across Sri Lanka.",
      ctaText: "More",
      href: "#",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122049011662332658.jpeg",
      galleryImages: [
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122049011662332658.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122049571431762039.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260112205202223714041.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122052491670935903.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260112205440780965981.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260112205513186027367.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601152223061825038494.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115222720309334382.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115222737689942931.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115223739144643106.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115224205315589977.jpeg",
        "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115232414506820802.jpeg",
      ],
    },
    {
      id: 5,
      title: "Sadaham Puja'24",
      date: "01/06/2024 - Ongoing",
      description:
        "The Bodhi Puja organized at Hunupitiya Gangarama Temple, aimed at seeking blessings for the Leoistic year 2024/2025. It brought together Leos, their families, and members from the Leo Club of Negombo Catamaran, fostering spiritual growth and community engagement.",
      ctaText: "Read More",
      href: "#",
      image: "/project-1.jpg"
    },
    {
      id: 6,
      title: "Sadaham Puja'24 : Phase 02",
      date: "26/11/2024",
      description:
        "The Seth Pirith Pooja, held at the Temple of the Tooth Relic in Kandy, was organized to bless A/L students and the wider community. The spiritually enriching event fostered unity and provided participants with peace, motivation, and renewed strength.",
      ctaText: "Read More",
      href: "#",
      image: "/project-2.jpg"
    },
    {
      id: 7,
      title: "Orientation Programme",
      date: "14/07/2024",
      description:
        "The two orientation programmes held in July equipped both executive and general members with leadership skills and unity for the year ahead.",
      ctaText: "Read More",
      href: "#",
      image: "/project-3.jpg"
    },
    {
      id: 8,
      title: "ELITE'24 : Annual Club Installation Ceremony",
      date: "15/09/2024",
      description:
        "ELITE'24, held at Vidma Hall, Boralesgamuwa, was a milestone installation ceremony where the club's charter certificate was officially presented, marking a proud moment for Leo Club of Pannipitiya Paradise.",
      ctaText: "Read More",
      href: "#",
      image: "/project-1.jpg"
    },
    {
      id: 9,
      title: "Pasalata Saviyak",
      date: "31/01/2025",
      description:
        "The Leo Club of Pannipitiya Paradise donated emulsion paint to enhance a classroom at Henry Steel Olcott Vidyalaya, improving the learning environment for students.",
      ctaText: "Read More",
      href: "#",
      image: "/project-2.jpg"
    },
    {
      id: 10,
      title: "Pasalata Saviyak : Phase 02",
      date: "04/02/2025",
      description:
        "At Ananda Samarakoon Vidyalaya, Wewala, Leos painted school benches and initiated volleyball court restoration, contributing to better facilities for students.",
      ctaText: "Read More",
      href: "#",
      image: "/project-3.jpg"
    },
    {
      id: 11,
      title: "PATH TO LEAD : PHASE 01",
      date: "08-09/11/2024",
      description:
        "A successful service project at Sri Subhuthi National School, aimed at enhancing leadership skills and personal development among school's prefects through workshops and training sessions.",
      ctaText: "Read More",
      href: "#",
      image: "/project-1.jpg"
    },
    {
      id: 12,
      title: "PATH TO LEAD : PHASE 02",
      date: "13-14/12/2024",
      description:
        "Held at Bonavista National College, Unawatuna, this two-day leadership and personality development program empowered prefects through workshops, training sessions, etiquette lessons, and drug prevention awareness.",
      ctaText: "Read More",
      href: "#",
      image: "/project-2.jpg"
    },
    {
      id: 13,
      title: "Senehase Avurudu",
      date: "18/04/2025",
      description:
        "Held at Camilla School, Mattegoda, and hosted with five other Leo Clubs, this was a compassionate and festive Inter District New Year celebration.",
      ctaText: "Read More",
      href: "#",
      image: "/project-3.jpg"
    },
    {
      id: 14,
      title: "HEALING HEARTS",
      date: "25/12/2024",
      description:
        "A compassionate Christmas visit to Apeksha Cancer Hospital in Maharagama, where donations for 100 children were distributed with the support of members, Lions, and Governor Lion Gaya Upasena.",
      ctaText: "Read More",
      href: "#",
      image: "/project-1.jpg"
    },
    {
      id: 15,
      title: "Walk For Peace",
      date: "31/08/2024",
      description:
        "A symbolic march bringing together Lions and Leos to raise awareness against child harassment, led by District Governor Lion Ranjith Fernando.",
      ctaText: "Read More",
      href: "#",
      image: "/project-2.jpg"
    },
    { 
      id: 16,
      title: "Feed the Paws",
      date: "29/12/2024 & 30/04/2025",
      description:
        "A compassionate initiative carried out in two phases, focusing on alleviating hunger among stray dogs through the preparation and distribution of specially made meal parcels.",
      ctaText: "Read More",
      href: "#",
      image: "/project-3.jpg"
    },
    {
      id: 17,
      title: "SOBA 2024",
      date: "02/01/2025",
      description:
        "Tree plantation project contributing to environmental conservation and sustainability in the local community.",
      ctaText: "Read More",
      href: "#",
      image: "/project-1.jpg"
    },
    {
      id: 18,
      title: "International Twinning Tree Plantation Drive 4.0",
      date: "20/04/2025",
      description:
        "In collaboration with Leo Club of Diphu Aspire (Leo District 322 D), planted over 30 trees in members' neighborhoods, contributing to global sustainability while strengthening international Leo bonds.",
      ctaText: "Read More",
      href: "#",
      image: "/project-2.jpg"
    },
    {
      id: 19,
      title: "Book Donation Project",
      date: "30/04/2025",
      description:
        "Donated over 400 quality books to underserved army and pirivena libraries through Mr. Kalana Chandimal Wakista.",
      ctaText: "Read More",
      href: "#",
      image: "/project-3.jpg"
    },
    {
      id: 20,
      title: "Igenumata Athwalak",
      date: "31/01/2025",
      description:
        "Book donation project at Henry Olcott Maha Vidyalaya to support underprivileged students with essential educational materials, led by Co-Chairpersons Leo Hasindu Induwara and Leo Matheesha De Silva.",
      ctaText: "Read More",
      href: "#",
      image: "/project-1.jpg"
    }
  ]
};

// Services Section
export interface ServiceItem {
  iconName: string;
  title: string;
  description: string;
}

export interface ServicesConfig {
  subtitle: string;
  titleLine1: string;
  titleLine2Italic: string;
  description: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  subtitle: "What We Do",
  titleLine1: "Our Core",
  titleLine2Italic: "Focus Areas",
  description: "We organize diverse projects and activities that address community needs while developing the leadership potential of our young members.",
  services: [
    {
      iconName: "Users",
      title: "Community Service",
      description: "Organizing impactful service projects that address local needs, from environmental cleanups to supporting vulnerable populations.",
    },
    {
      iconName: "Sparkles",
      title: "Leadership Development",
      description: "Workshops, training sessions, and hands-on experiences that build essential leadership skills in young individuals.",
    },
    {
      iconName: "Diamond",
      title: "Youth Empowerment",
      description: "Creating platforms for young people to voice their ideas, develop confidence, and take initiative in community development.",
    },
    {
      iconName: "Camera",
      title: "Social Awareness",
      description: "Campaigns and events that raise awareness about important social issues and inspire positive action in our community.",
    },
  ],
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
      image: "/feature-1.jpg",
      imageAlt: "Team Collaboration",
      title: "Strong Team Spirit",
      description: "Our members work together with passion and dedication, creating a supportive environment where everyone can contribute and grow.",
    },
    {
      image: "/feature-2.jpg",
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

// Testimonials Section
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface TestimonialsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  testimonials: Testimonial[];
}

export const testimonialsConfig: TestimonialsConfig = {
  subtitle: "Member Stories",
  titleRegular: "Voices from Our",
  titleItalic: "Community",
  testimonials: [
    {
      id: 1,
      name: "Governor Lion Gaya Upasena",
      role: "District Governor for Lions District 306 D7 (2025/2026)",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/lion-gaya-upasena.jpg",
      quote: "Being part of Leo Club has transformed my perspective on leadership. I've learned that true leadership is about serving others and creating positive change in our community.",
    },
    {
      id: 2,
      name: "Lion Ranjith Fernando",
      role: "Immediate Past District Governor for Lions District 306 C2 (2024/2025)",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/lion-ranjith-fernando.jpeg",
      quote: "The friendships I've made and the skills I've developed here are invaluable. Leo Club gave me the platform to turn my ideas into real community impact.",
    },
    {
      id: 3,
      name: "Lion Chamath C.Jayalath",
      role: "Club President of Lions Club of Pannipitiya Paradise",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/chamath-jayalath.jpg",
      quote: "From organizing health camps to environmental projects, every experience has been rewarding. I'm proud to be part of an organization that truly cares.",
    },
    {
      id: 4,
      name: "Leo Lion Lithira Ramuditha",
      role: "Immediate Past President of Leo Club of Pannipitiya Paradise",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/lithira-ramuditha.jpg",
      quote: "Leo Club taught me the value of teamwork and dedication. Working with passionate young people toward common goals has been an incredible journey.",
    },
  ],
};

// FAQ Section
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
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  subtitle: "Common Questions",
  titleRegular: "Frequently Asked",
  titleItalic: "Questions",
  ctaText: "Still have questions?",
  ctaButtonText: "Contact Us",
  ctaHref: "#footer",
  faqs: [
    {
      id: "faq-1",
      question: "What is Leo Club?",
      answer: "Leo Club is a youth organization sponsored by Lions Clubs International. It provides young people with opportunities for personal growth, leadership development, and community service. 'LEO' stands for Leadership, Experience, and Opportunity.",
    },
    {
      id: "faq-2",
      question: "How can I join Leo Club of Pannipitiya Paradise?",
      answer: "We welcome young people aged 18-30 who are passionate about community service and personal development. You can contact us through our social media pages or email to express your interest in joining. We conduct regular recruitment drives throughout the year.",
    },
    {
      id: "faq-3",
      question: "What types of projects does the club organize?",
      answer: "We organize a wide range of projects including environmental initiatives, educational support programs, fundraising events for charitable causes and leadership development workshops. Our projects are designed to address real community needs.",
    },
    {
      id: "faq-4",
      question: "Are there any membership fees?",
      answer: "Yes, there is a nominal annual membership fee that helps cover administrative costs and project expenses. However, we ensure that financial constraints never prevent passionate individuals from joining. Scholarships and flexible payment options are available.",
    },
    {
      id: "faq-5",
      question: "How often does the club meet?",
      answer: "We hold regular monthly meetings to discuss ongoing projects and plan future activities. Additionally, we have project-specific meetings and social gatherings throughout the month. Members are expected to attend meetings regularly and participate in projects.",
    },
  ],
};

// Board Members Page
export interface MemberContactLink {
  label: string;
  href: string;
}

export interface BoardMember {
  id: number;
  role: string;
  name: string;
  image: string;
  imageAlt: string;
  cvLink: string;
  contactNumber: string;
  contactLinks: MemberContactLink[];
  displayOrder?: number;
  email?: string;
  linkedin?: string;
  bio?: string;
}

export interface BoardMembersConfig {
  subtitle: string;
  title: string;
  members: BoardMember[];
}

export const boardMembersConfig: BoardMembersConfig = {
  subtitle: "Leoistic Year 2025/26",
  title: "Board Members",
  members: [
    {
      id: 1,
      role: "President",
      name: "Leo Lion Onel Herath",
      image: "/Onel Herath.jpg",
      imageAlt: "Leo Lion Onel Herath",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 2,
      role: "1st Vice President",
      name: "Leo Janith Vishula",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/janith-vishula.jpg",
      imageAlt: "Leo Janith Vishula",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 3,
      role: "2nd Vice President",
      name: "Leo Saviru Senevirathne",
      image: "/feature-1.jpg",
      imageAlt: "Leo Saviru Senevirathne",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 4,
      role: "3rd Vice President",
      name: "Leo Lion Winnath Edisooriya",
      image: "/feature-2.jpg",
      imageAlt: "Leo Lion Winnath Edisooriya",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 5,
      role: "Secretary",
      name: "Leo Lion Matheesha De Silva",
      image: "/gallery-1.jpg",
      imageAlt: "Leo Lion Matheesha De Silva",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 6,
      role: "Treasurer",
      name: "Leo Hasindu Induwara",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/hasindu-induwara.jpg",
      imageAlt: "Leo Hasindu Induwara",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 7,
      role: "Advisor",
      name: "Lion Chamath C Jayalath",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/chamath-jayalath.jpg",
      imageAlt: "Lion Chamath C Jayalath",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 8,
      role: "Immediate Past President",
      name: "Leo Lion Lithira Ramuditha",
      image: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/lithira-ramuditha.jpg",
      imageAlt: "Leo Lion Lithira Ramuditha",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 9,
      role: "Assistant Secretary",
      name: "Leo Lion Uvin Kaveesh",
      image: "/gallery-2.jpg",
      imageAlt: "Leo Lion Uvin Kaveesh",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 10,
      role: "Assistant Secretary",
      name: "",
      image: "/gallery-3.jpg",
      imageAlt: "Assistant Secretary",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 11,
      role: "Assistant Treasurer",
      name: "Leo Sandinu Nethmika",
      image: "/gallery-4.jpg",
      imageAlt: "Leo Sandinu Nethmika",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
    {
      id: 12,
      role: "Assistant Treasurer",
      name: "Leo Bhagya Supun",
      image: "/gallery-5.jpg",
      imageAlt: "Leo Bhagya Supun",
      cvLink: "#",
      contactNumber: "Not provided",
      contactLinks: [
        { label: "WhatsApp", href: "#" },
        { label: "Email", href: "#" },
      ],
    },
  ],
};

// Awards & Achievements Page
export interface AchievementItem {
  title: string;
  details: string[];
  image?: string;
  imageAlt?: string;
}

export interface AchievementsConfig {
  subtitle: string;
  title: string;
  projectAwards: AchievementItem[];
  individualAwards: AchievementItem[];
  specialRecognition: string;
}

export const achievementsConfig: AchievementsConfig = {
  subtitle: "Recognition & Excellence",
  title: "Awards and Achievements",
  projectAwards: [
    {
      title: "RESILENCIA'24",
      image: undefined,
      imageAlt: "RESILENCIA'24 award",
      details: [
        "Most Outstanding New Leo Club - 1st Runners Up",
      ],
    },
    {
      title: "RESILENCIA'25",
      image: undefined,
      imageAlt: "RESILENCIA'25 awards",
      details: [
        "Winner 🥇 - Best Project for Youth: Path to Lead",
        "1st Runners Up 🥈 - Best Project for Childhood Cancer: Healing Hearts",
        "1st Runners Up 🥈 - Best International Joint Project: International Tree Plantation Drive 4.0",
      ],
    },
  ],
  individualAwards: [
    {
      title: "Most Popular Leo",
      image: undefined,
      imageAlt: "Most Popular Leo award",
      details: [
        "Leo Lion Thavisha Banadara",
      ],
    },
    {
      title: "Best Leo Advisor - 1st Runners Up",
      image: undefined,
      imageAlt: "Best Leo Advisor award",
      details: [
        "Lion Chamath C. Jayalath",
      ],
    },
    {
      title: "District President Appreciation Award",
      image: undefined,
      imageAlt: "District President Appreciation Award",
      details: [
        "Leo Lion Lithira Ramuditha",
        "Leo Lion Thavisha Bandara",
      ],
    },
    {
      title: "Most Outstanding Club Presidents Top 20",
      image: undefined,
      imageAlt: "Most Outstanding Club Presidents Top 20",
      details: [
        "Leo Lion Lithira Ramuditha",
      ],
    },
  ],
  specialRecognition: "Mid Year Review - District 306C2: Most Popular Community Based Leo Club of District 306C2",
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
    { label: "About Us", href: "#intro" },
    { label: "Our Projects", href: "#projects" },
    { label: "Services", href: "#services" },
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
