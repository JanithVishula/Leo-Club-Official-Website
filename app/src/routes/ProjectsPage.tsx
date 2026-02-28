import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { featuredProjectsConfig } from '../config';
import { listProjectsPublic } from '../lib/cmsApi';

function parseProjectDateToTimestamp(rawDate: string): number {
  const values: number[] = [];

  const numericMatches = rawDate.matchAll(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/g);
  for (const match of numericMatches) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const time = new Date(year, month, day).getTime();
    if (!Number.isNaN(time)) values.push(time);
  }

  const textMatches = rawDate.matchAll(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/g);
  const monthLookup: Record<string, number> = {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    sept: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  };

  for (const match of textMatches) {
    const day = Number(match[1]);
    const monthName = match[2].toLowerCase();
    const year = Number(match[3]);
    const month = monthLookup[monthName];
    if (month !== undefined) {
      const time = new Date(year, month, day).getTime();
      if (!Number.isNaN(time)) values.push(time);
    }
  }

  return values.length ? Math.max(...values) : 0;
}

export function ProjectsPage() {
  const [projects, setProjects] = useState(featuredProjectsConfig.projects);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadProjects = async () => {
      const remoteProjects = await listProjectsPublic();
      if (!remoteProjects.length) return;

      const mapped = remoteProjects.map((item, index) => ({
        id: 10000 + index,
        title: item.title,
        date: item.dateText,
        image: item.imageUrl,
        description: item.description,
        ctaText: 'Read More',
        href: '#',
        category: item.category || undefined,
        galleryImages: item.galleryImages,
      }));

      setProjects([...mapped, ...featuredProjectsConfig.projects]);
    };

    loadProjects();
  }, []);

  const sortedProjects = [...projects].sort(
    (a, b) => parseProjectDateToTimestamp(b.date) - parseProjectDateToTimestamp(a.date)
  );

  const activeProject = activeProjectId !== null
    ? sortedProjects.find((project) => project.id === activeProjectId) || null
    : null;

  const activeImages = (activeProject?.galleryImages?.length
    ? activeProject.galleryImages
    : activeProject
      ? [activeProject.image]
      : []).filter((img) => img && img.trim() !== '');

  const openGallery = (projectId: number) => {
    setActiveProjectId(projectId);
    setActiveImageIndex(0);
  };

  const closeGallery = () => {
    setActiveProjectId(null);
    setActiveImageIndex(0);
  };

  const showNext = () => {
    if (!activeImages.length) return;
    setActiveImageIndex((prev) => (prev + 1) % activeImages.length);
  };

  const showPrev = () => {
    if (!activeImages.length) return;
    setActiveImageIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!activeProject) return;
      if (event.key === 'Escape') {
        setActiveProjectId(null);
        setActiveImageIndex(0);
      }
      if (event.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % activeImages.length);
      }
      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject, activeImages.length]);

  return (
    <main className="page-enter min-h-screen w-full bg-slate-950 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-3">Our Initiatives</p>
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">All Projects</h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-body text-sm transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>

        <div className="space-y-20 md:space-y-24">
          {sortedProjects.map((project, index) => (
            <div
              key={project.id}
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`relative overflow-hidden rounded-lg ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                {project.galleryImages && project.galleryImages.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => openGallery(project.id)}
                    className="aspect-[4/3] overflow-hidden block w-full text-left group relative"
                    aria-label={`Open gallery for ${project.title}`}
                  >
                    {project.image && project.image.trim() !== '' ? (
                      <>
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium transition-opacity">
                            View Gallery ({project.galleryImages.length} photos)
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <span className="text-white/50 text-sm">No Image Available</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="aspect-[4/3] overflow-hidden">
                    {project.image && project.image.trim() !== '' ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <span className="text-white/50 text-sm">No Image Available</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={index % 2 === 1 ? 'md:order-1 md:text-right' : ''}>
                {project.category && (
                  <p className={`text-white/60 font-body text-xs uppercase tracking-widest mb-2 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                    {project.category}
                  </p>
                )}
                <p className={`text-white/50 font-body text-sm mb-4 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                  {project.date}
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold text-white tracking-tight mb-4">
                  {project.title}
                </h2>
                <p className="text-white/60 font-body text-base md:text-lg leading-relaxed mb-6">
                  {project.description}
                </p>
                <button
                  type="button"
                  onClick={() => openGallery(project.id)}
                  className={`inline-flex items-center gap-2 text-white font-body text-sm border-b border-white/30 pb-1 hover:border-white transition-colors duration-300 group ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {project.ctaText || 'Read More'}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeProject && activeImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeGallery}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="overflow-hidden rounded-xl bg-slate-950">
              <img
                src={activeImages[activeImageIndex]}
                alt={`${activeProject.title} image ${activeImageIndex + 1}`}
                className="w-full h-[70vh] object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-white">
              <div>
                <p className="text-sm text-white/60">{activeProject.title}</p>
                <p className="text-xs text-white/50">{activeImageIndex + 1} / {activeImages.length}</p>
              </div>

              {activeImages.length > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={showPrev}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 hover:border-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 hover:border-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
