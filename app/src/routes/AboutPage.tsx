import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AboutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lionism');
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBackClick = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/');
      },
    });
  };

  return (
    <div ref={pageRef} className="relative w-full min-h-screen bg-slate-950">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Back to Home Button */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-body">Back to Home</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="mb-12 md:mb-16">
          <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-4">
            Learn More
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight leading-tight">
            About
            <br />
            <span className="font-serif italic font-normal text-white/80">Us</span>
          </h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto bg-slate-900/50 border border-white/10 p-1 rounded-lg mb-8">
            <TabsTrigger 
              value="lionism" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white/70 transition-all duration-300"
            >
              What is Lionism & Leoism?
            </TabsTrigger>
            <TabsTrigger 
              value="story" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white/70 transition-all duration-300"
            >
              Our Story
            </TabsTrigger>
          </TabsList>

          {/* Lionism & Leoism Tab */}
          <TabsContent value="lionism" className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Lions Club International */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-8 md:p-10 rounded-lg border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                    <img 
                      src="/lions-logo.png" 
                      alt="Lions Club International Logo" 
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                    Lions Club International
                  </h2>
                </div>
                <div className="space-y-4 text-white/70 font-body leading-relaxed">
                  <p>
                    Lions Clubs International is the world's largest service club organization, with more than 1.4 million members in over 200 countries and geographic areas around the globe.
                  </p>
                  <p>
                    Founded in 1917, Lions are recognized for their commitment to strengthening communities through humanitarian service and grants that impact lives globally and locally.
                  </p>
                  <p className="text-white/50 italic text-sm">
                    Motto: "We Serve"
                  </p>
                </div>
              </div>

              {/* Leo Clubs */}
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/60 p-8 md:p-10 rounded-lg border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                    <img 
                      src="/Logo.png" 
                      alt="Leo Club Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                    Leo Clubs
                  </h2>
                </div>
                <div className="space-y-4 text-white/70 font-body leading-relaxed">
                  <p>
                    Leo clubs are a youth organization of Lions Clubs International. Leo club members are young people ages 12-30 who work together to strengthen their communities and families.
                  </p>
                  <p>
                    "Leo" stands for <strong className="text-white">L</strong>eadership, <strong className="text-white">E</strong>xperience, <strong className="text-white">O</strong>pportunity. Leo clubs provide youth with an opportunity for development and contribution to their communities through service activities and leadership opportunities.
                  </p>
                  <p className="text-white/50 italic text-sm">
                    Founded: 1957 | Active worldwide in over 150 countries
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-900/50 p-8 md:p-10 rounded-lg border border-white/10">
              <h3 className="text-xl md:text-2xl font-sans font-semibold text-white mb-6">
                The Connection
              </h3>
              <p className="text-white/70 font-body leading-relaxed">
                Leo clubs are sponsored by Lions clubs, creating a partnership between young people and experienced community leaders. This mentorship model allows Leos to develop their leadership skills while making meaningful contributions to their communities. Many Leo club members go on to become Lions club members when they age out of the Leo program, continuing their commitment to service.
              </p>
            </div>
          </TabsContent>

          {/* Our Story Tab */}
          <TabsContent value="story" className="space-y-8">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-8 md:p-10 rounded-lg border border-white/10 min-h-[400px] flex flex-col items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-sans font-semibold text-white">
                  Our Story is Being Written
                </h2>
                <p className="text-white/50 font-body max-w-md mx-auto">
                  The inspiring journey of Leo Club of Pannipitiya Paradise will be shared here soon. Check back later for updates on our history, milestones, and the passionate individuals who made it all possible.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
