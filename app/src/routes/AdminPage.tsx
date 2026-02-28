import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  createAchievementAdmin,
  createProjectAdmin,
  deleteAchievementAdmin,
  deleteProjectAdmin,
  getCurrentSession,
  listAchievementsAdmin,
  listApplicationsAdmin,
  listProjectsAdmin,
  signInAdmin,
  signOutAdmin,
  updateApplicationAdmin,
  type ApplicationStatus,
  type CmsAchievementCategory,
  type CmsAchievementRecord,
  type CmsProjectRecord,
  type MembershipApplicationRecord,
} from '../lib/cmsApi';
import { adminEmail, isSupabaseConfigured } from '../lib/supabase';

type AdminTab = 'applications' | 'projects' | 'achievements';

export function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [sessionEmail, setSessionEmail] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('applications');

  const [loginEmail, setLoginEmail] = useState(adminEmail);
  const [loginPassword, setLoginPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [applications, setApplications] = useState<MembershipApplicationRecord[]>([]);
  const [projects, setProjects] = useState<CmsProjectRecord[]>([]);
  const [achievements, setAchievements] = useState<CmsAchievementRecord[]>([]);
  const [busyMessage, setBusyMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [projectForm, setProjectForm] = useState({
    title: '',
    dateText: '',
    category: '',
    description: '',
    imageUrl: '',
    galleryImagesText: '',
    isFeatured: true,
    displayOrder: 0,
  });

  const [achievementForm, setAchievementForm] = useState({
    category: 'project' as CmsAchievementCategory,
    title: '',
    detailsText: '',
    imageUrl: '',
    imageAlt: '',
    displayOrder: 0,
  });

  const loadDashboardData = async () => {
    setErrorMessage('');
    try {
      const [applicationRows, projectRows, achievementRows] = await Promise.all([
        listApplicationsAdmin(),
        listProjectsAdmin(),
        listAchievementsAdmin(),
      ]);
      setApplications(applicationRows);
      setProjects(projectRows);
      setAchievements(achievementRows);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load admin data.';
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const session = await getCurrentSession();
        const email = session?.user?.email?.toLowerCase() || '';
        if (session && email && email === adminEmail) {
          setIsAuthed(true);
          setSessionEmail(session.user.email || '');
          await loadDashboardData();
        }
      } catch {
        setAuthError('Unable to initialize admin session.');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const statusCounts = useMemo(() => {
    return applications.reduce(
      (acc, app) => {
        acc[app.status] += 1;
        return acc;
      },
      { new: 0, reviewing: 0, accepted: 0, rejected: 0 } as Record<ApplicationStatus, number>
    );
  }, [applications]);

  const onLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    try {
      setLoggingIn(true);
      const session = await signInAdmin(loginEmail.trim(), loginPassword);
      setSessionEmail(session?.user?.email || '');
      setIsAuthed(true);
      setLoginPassword('');
      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed.';
      setAuthError(message);
    } finally {
      setLoggingIn(false);
    }
  };

  const onLogout = async () => {
    await signOutAdmin();
    setIsAuthed(false);
    setSessionEmail('');
    setApplications([]);
    setProjects([]);
    setAchievements([]);
  };

  const onApplicationUpdate = async (id: string, status: ApplicationStatus, adminNotes: string) => {
    setBusyMessage('Updating application...');
    setErrorMessage('');
    try {
      await updateApplicationAdmin({ id, status, adminNotes });
      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update application.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
    }
  };

  const onCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyMessage('Adding project...');
    setErrorMessage('');
    try {
      const galleryImages = projectForm.galleryImagesText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

      await createProjectAdmin({
        title: projectForm.title.trim(),
        dateText: projectForm.dateText.trim(),
        category: projectForm.category.trim(),
        description: projectForm.description.trim(),
        imageUrl: projectForm.imageUrl.trim(),
        galleryImages,
        isFeatured: projectForm.isFeatured,
        displayOrder: Number(projectForm.displayOrder || 0),
      });

      setProjectForm({
        title: '',
        dateText: '',
        category: '',
        description: '',
        imageUrl: '',
        galleryImagesText: '',
        isFeatured: true,
        displayOrder: 0,
      });

      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add project.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
    }
  };

  const onCreateAchievement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyMessage('Adding achievement...');
    setErrorMessage('');
    try {
      const details = achievementForm.detailsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

      await createAchievementAdmin({
        category: achievementForm.category,
        title: achievementForm.title.trim(),
        details,
        imageUrl: achievementForm.imageUrl.trim(),
        imageAlt: achievementForm.imageAlt.trim(),
        displayOrder: Number(achievementForm.displayOrder || 0),
      });

      setAchievementForm({
        category: 'project',
        title: '',
        detailsText: '',
        imageUrl: '',
        imageAlt: '',
        displayOrder: 0,
      });

      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add achievement.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
    }
  };

  const onDeleteProject = async (id: string) => {
    setBusyMessage('Removing project...');
    setErrorMessage('');
    try {
      await deleteProjectAdmin(id);
      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove project.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
    }
  };

  const onDeleteAchievement = async (id: string) => {
    setBusyMessage('Removing achievement...');
    setErrorMessage('');
    try {
      await deleteAchievementAdmin(id);
      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove achievement.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-slate-950 py-24 px-6 md:px-12 text-white">
        <div className="max-w-4xl mx-auto">Loading admin dashboard...</div>
      </main>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen w-full bg-slate-950 py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto rounded-xl border border-amber-300/30 bg-amber-900/20 p-6">
          <h1 className="text-2xl font-sans font-bold text-amber-50 mb-3">Admin setup required</h1>
          <p className="text-amber-100/90 font-body text-sm md:text-base">
            Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_ADMIN_EMAIL in your environment to enable admin features.
          </p>
          <Link to="/" className="inline-flex mt-5 text-amber-100/90 hover:text-amber-50">Back to Home</Link>
        </div>
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="page-enter min-h-screen w-full bg-slate-950 py-24 md:py-32">
        <div className="max-w-xl mx-auto px-6 md:px-12">
          <div className="mb-10">
            <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-3">Admin</p>
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">Dashboard Login</h1>
          </div>

          <section className="rounded-xl border border-white/10 bg-slate-900/80 p-6 md:p-8">
            <form className="space-y-5" onSubmit={onLogin}>
              <label className="block">
                <span className="block text-white/75 text-sm font-body mb-2">Admin Email</span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className="w-full h-11 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white outline-none focus:border-white/50"
                />
              </label>

              <label className="block">
                <span className="block text-white/75 text-sm font-body mb-2">Password</span>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="w-full h-11 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white outline-none focus:border-white/50"
                />
              </label>

              {authError && (
                <div className="rounded-md border border-red-300/30 bg-red-900/20 p-3">
                  <p className="text-red-100 text-sm">{authError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loggingIn}
                className="inline-flex items-center justify-center rounded-md bg-white text-slate-950 px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors duration-300"
              >
                {loggingIn ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter min-h-screen w-full bg-slate-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-2">Admin Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">Website Content Manager</h1>
            <p className="text-white/60 text-sm mt-2">Signed in as {sessionEmail}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/70 hover:text-white text-sm">Home</Link>
            <button type="button" onClick={onLogout} className="text-white/70 hover:text-white text-sm">Sign Out</button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {(['applications', 'projects', 'achievements'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-body transition-colors ${
                activeTab === tab ? 'bg-white text-slate-950' : 'bg-slate-900 text-white/75 hover:text-white'
              }`}
            >
              {tab === 'applications' ? 'Applications' : tab === 'projects' ? 'Projects' : 'Achievements'}
            </button>
          ))}
        </div>

        {busyMessage && (
          <div className="mb-4 rounded-md border border-blue-300/30 bg-blue-900/20 p-3 text-blue-100 text-sm">
            {busyMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-300/30 bg-red-900/20 p-3 text-red-100 text-sm">
            {errorMessage}
          </div>
        )}

        {activeTab === 'applications' && (
          <section className="space-y-5">
            <div className="grid md:grid-cols-4 gap-3">
              <StatCard label="New" value={statusCounts.new} />
              <StatCard label="Reviewing" value={statusCounts.reviewing} />
              <StatCard label="Accepted" value={statusCounts.accepted} />
              <StatCard label="Rejected" value={statusCounts.rejected} />
            </div>

            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} onSave={onApplicationUpdate} />
              ))}
              {applications.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6 text-white/70">No applications yet.</div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
          <section className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={onCreateProject} className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <h2 className="text-xl font-sans font-semibold text-white">Add Project</h2>
              <TextField label="Title" value={projectForm.title} onChange={(value) => setProjectForm((prev) => ({ ...prev, title: value }))} />
              <TextField label="Date" value={projectForm.dateText} onChange={(value) => setProjectForm((prev) => ({ ...prev, dateText: value }))} />
              <TextField label="Category" value={projectForm.category} onChange={(value) => setProjectForm((prev) => ({ ...prev, category: value }))} />
              <TextAreaField label="Description" value={projectForm.description} onChange={(value) => setProjectForm((prev) => ({ ...prev, description: value }))} rows={4} />
              <TextField label="Main Image URL" value={projectForm.imageUrl} onChange={(value) => setProjectForm((prev) => ({ ...prev, imageUrl: value }))} />
              <TextAreaField label="Gallery Image URLs (one per line)" value={projectForm.galleryImagesText} onChange={(value) => setProjectForm((prev) => ({ ...prev, galleryImagesText: value }))} rows={4} />
              <div className="grid grid-cols-2 gap-4">
                <label className="text-white/80 text-sm">
                  <span className="block mb-2">Display Order</span>
                  <input
                    type="number"
                    value={projectForm.displayOrder}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, displayOrder: Number(event.target.value) }))}
                    className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm mt-8">
                  <input
                    type="checkbox"
                    checked={projectForm.isFeatured}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, isFeatured: event.target.checked }))}
                  />
                  Feature on home page
                </label>
              </div>
              <button type="submit" className="rounded-md bg-white text-slate-950 px-4 py-2 text-sm font-semibold">Add Project</button>
            </form>

            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-3">
              <h2 className="text-xl font-sans font-semibold text-white">Existing Projects</h2>
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-md border border-white/10 p-3">
                    <p className="text-white font-semibold">{project.title}</p>
                    <p className="text-white/60 text-xs mt-1">{project.dateText} • {project.category || 'General'}</p>
                    <div className="mt-2">
                      <button type="button" onClick={() => onDeleteProject(project.id)} className="text-red-300 hover:text-red-200 text-xs">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-white/60 text-sm">No projects yet.</p>}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'achievements' && (
          <section className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={onCreateAchievement} className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <h2 className="text-xl font-sans font-semibold text-white">Add Achievement</h2>
              <label className="block text-white/80 text-sm">
                <span className="block mb-2">Category</span>
                <select
                  value={achievementForm.category}
                  onChange={(event) => setAchievementForm((prev) => ({ ...prev, category: event.target.value as CmsAchievementCategory }))}
                  className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white"
                >
                  <option value="project">Project Award</option>
                  <option value="individual">Individual Award</option>
                  <option value="special">Special Recognition</option>
                </select>
              </label>
              <TextField label="Title" value={achievementForm.title} onChange={(value) => setAchievementForm((prev) => ({ ...prev, title: value }))} />
              <TextAreaField label="Details (one line per bullet)" value={achievementForm.detailsText} onChange={(value) => setAchievementForm((prev) => ({ ...prev, detailsText: value }))} rows={4} />
              <TextField label="Image URL" value={achievementForm.imageUrl} onChange={(value) => setAchievementForm((prev) => ({ ...prev, imageUrl: value }))} />
              <TextField label="Image Alt" value={achievementForm.imageAlt} onChange={(value) => setAchievementForm((prev) => ({ ...prev, imageAlt: value }))} />
              <label className="block text-white/80 text-sm">
                <span className="block mb-2">Display Order</span>
                <input
                  type="number"
                  value={achievementForm.displayOrder}
                  onChange={(event) => setAchievementForm((prev) => ({ ...prev, displayOrder: Number(event.target.value) }))}
                  className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white"
                />
              </label>
              <button type="submit" className="rounded-md bg-white text-slate-950 px-4 py-2 text-sm font-semibold">Add Achievement</button>
            </form>

            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-3">
              <h2 className="text-xl font-sans font-semibold text-white">Existing Achievements</h2>
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="rounded-md border border-white/10 p-3">
                    <p className="text-white font-semibold">{achievement.title}</p>
                    <p className="text-white/60 text-xs mt-1">{achievement.category}</p>
                    <button type="button" onClick={() => onDeleteAchievement(achievement.id)} className="mt-2 text-red-300 hover:text-red-200 text-xs">
                      Delete
                    </button>
                  </div>
                ))}
                {achievements.length === 0 && <p className="text-white/60 text-sm">No achievements yet.</p>}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/80 p-4">
      <p className="text-white/50 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-white text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-white/80 text-sm">
      <span className="block mb-2">{label}</span>
      <input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows }: { label: string; value: string; onChange: (value: string) => void; rows: number }) {
  return (
    <label className="block text-white/80 text-sm">
      <span className="block mb-2">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        className="w-full rounded-md border border-white/20 bg-slate-950/60 px-3 py-2 text-white"
      />
    </label>
  );
}

function ApplicationCard({
  application,
  onSave,
}: {
  application: MembershipApplicationRecord;
  onSave: (id: string, status: ApplicationStatus, notes: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [notes, setNotes] = useState(application.adminNotes || '');

  useEffect(() => {
    setStatus(application.status);
    setNotes(application.adminNotes || '');
  }, [application.id, application.status, application.adminNotes]);

  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/80 p-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-white text-lg font-semibold">{application.fullName}</p>
          <p className="text-white/60 text-sm">{application.email} • {application.phone}</p>
          <p className="text-white/50 text-xs mt-1">Submitted: {new Date(application.createdAt).toLocaleString()}</p>
          {application.organization && <p className="text-white/60 text-sm mt-2">{application.organization}</p>}
          <p className="text-white/75 text-sm mt-3 leading-relaxed">{application.motivation}</p>
        </div>

        <div className="w-full md:w-72 space-y-3">
          <label className="block text-white/70 text-xs uppercase tracking-widest">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
            className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white"
          >
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Admin notes"
            className="w-full rounded-md border border-white/20 bg-slate-950/60 px-3 py-2 text-white"
          />

          <button
            type="button"
            onClick={() => onSave(application.id, status, notes)}
            className="rounded-md bg-white text-slate-950 px-4 py-2 text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </article>
  );
}
