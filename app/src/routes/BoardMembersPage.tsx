import { Link } from 'react-router-dom';
import { boardMembersConfig } from '../config';

export function BoardMembersPage() {
  const hierarchyOrder: Record<string, number> = {
    President: 1,
    Advisor: 2,
    'Immediate Past President': 2,
    '1st Vice President': 3,
    '2nd Vice President': 3,
    '3rd Vice President': 3,
    Secretary: 4,
    Treasurer: 4,
    'Assistant Secretary': 5,
    'Assistant Treasurer': 5,
  };

  const getCardSpanClasses = (role: string) => {
    if (role === 'President') return 'sm:col-span-2 lg:col-span-6';
    if (role === 'Advisor' || role === 'Immediate Past President') return 'lg:col-span-3';
    return 'lg:col-span-2';
  };

  const getImageAspectClass = (role: string) => {
    if (role === 'President') return 'aspect-[16/6]';
    if (role === 'Advisor' || role === 'Immediate Past President') return 'aspect-[16/9]';
    return 'aspect-[4/3]';
  };

  const getNameSizeClass = (role: string) => {
    if (role === 'President') return 'text-2xl md:text-3xl';
    if (role === 'Advisor' || role === 'Immediate Past President') return 'text-2xl';
    return 'text-xl';
  };

  const sortedMembers = [...boardMembersConfig.members].sort((a, b) => {
    const aRank = hierarchyOrder[a.role] ?? Number.MAX_SAFE_INTEGER;
    const bRank = hierarchyOrder[b.role] ?? Number.MAX_SAFE_INTEGER;

    if (aRank !== bRank) return aRank - bRank;
    return a.id - b.id;
  });

  return (
    <main className="page-enter min-h-screen w-full bg-slate-950 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-3">{boardMembersConfig.subtitle}</p>
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">{boardMembersConfig.title}</h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-body text-sm transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {sortedMembers.map((member) => (
            <article
              key={member.id}
              className={`overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 ${getCardSpanClasses(member.role)}`}
            >
              <div className={`${getImageAspectClass(member.role)} overflow-hidden`}>
                <img
                  src={member.image}
                  alt={member.imageAlt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50 font-body mb-2">{member.role}</p>
                  <h2 className={`${getNameSizeClass(member.role)} font-sans font-semibold text-white`}>
                    {member.name || 'To Be Announced'}
                  </h2>
                </div>

                <div className="space-y-2 text-sm font-body text-white/70">
                  <p>
                    Contact: {member.contactNumber === 'Not provided' ? 'Not provided yet' : member.contactNumber}
                  </p>
                  <a
                    href={member.cvLink}
                    target={member.cvLink.startsWith('http') ? '_blank' : undefined}
                    rel={member.cvLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-block text-white border-b border-white/30 pb-0.5 hover:border-white transition-colors duration-300"
                  >
                    CV Link
                  </a>
                </div>

                <div className="flex items-center gap-4 text-sm font-body">
                  {member.contactLinks.map((contact) => (
                    <a
                      key={contact.label}
                      href={contact.href}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {contact.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
