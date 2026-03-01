import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { achievementsConfig } from '../config';
import { listAchievementsPublic, type CmsAchievementRecord } from '../lib/cmsApi';

export function AwardsAchievementsPage() {
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

  const projectAwards = useMemo(() => {
    const rows = remoteAchievements.filter((item) => item.category === 'project');
    return rows.map((item) => ({
      title: item.title,
      details: item.details,
      image: item.imageUrl || '',
      imageAlt: item.imageAlt || item.title,
    }));
  }, [remoteAchievements]);

  const individualAwards = useMemo(() => {
    const rows = remoteAchievements.filter((item) => item.category === 'individual');
    return rows.map((item) => ({
      title: item.title,
      details: item.details,
      image: item.imageUrl || '',
      imageAlt: item.imageAlt || item.title,
    }));
  }, [remoteAchievements]);

  const specialRecognition = useMemo(() => {
    const row = remoteAchievements.find((item) => item.category === 'special');
    if (!row) return { text: '', image: null, imageAlt: null };
    return { 
      text: row.details[0] || row.title, 
      image: row.imageUrl || null,
      imageAlt: row.imageAlt || row.title
    };
  }, [remoteAchievements]);

  return (
    <main className="page-enter min-h-screen w-full bg-slate-950 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-body">Back to Home</span>
          </Link>
        </div>

        <div className="mb-12">
          <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-3">{achievementsConfig.subtitle}</p>
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">{achievementsConfig.title}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-slate-900/80 p-6 md:p-8">
            <h2 className="text-2xl font-sans font-semibold text-white mb-6">Project Awards</h2>
            <div className="space-y-6">
              {projectAwards.map((award) => (
                <article key={award.title} className="rounded-lg border border-white/10 bg-slate-950/50 p-5">
                  <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-md border border-white/10 bg-slate-900/80">
                    {award.image ? (
                      <img
                        src={award.image}
                        alt={award.imageAlt || award.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-white/20 text-xs uppercase tracking-widest text-white/40 font-body">
                        Add Award Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-sans font-semibold text-white mb-3">{award.title}</h3>
                  <ul className="space-y-2 text-sm md:text-base text-white/75 font-body">
                    {award.details.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-slate-900/80 p-6 md:p-8">
            <h2 className="text-2xl font-sans font-semibold text-white mb-6">Individual Awards</h2>
            <div className="space-y-6">
              {individualAwards.map((award) => (
                <article key={award.title} className="rounded-lg border border-white/10 bg-slate-950/50 p-5">
                  <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-md border border-white/10 bg-slate-900/80">
                    {award.image ? (
                      <img
                        src={award.image}
                        alt={award.imageAlt || award.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-white/20 text-xs uppercase tracking-widest text-white/40 font-body">
                        Add Award Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-sans font-semibold text-white mb-3">{award.title}</h3>
                  <ul className="space-y-2 text-sm md:text-base text-white/75 font-body">
                    {award.details.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-xl border border-blue-300/20 bg-blue-950/30 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-sans font-semibold text-white mb-3">Special Recognition</h2>
          {specialRecognition.image && (
            <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-md border border-white/10 bg-slate-900/80">
              <img
                src={specialRecognition.image}
                alt={specialRecognition.imageAlt || 'Special Recognition'}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <p className="text-white/80 font-body leading-relaxed">{specialRecognition.text}</p>
        </section>
      </div>
    </main>
  );
}
