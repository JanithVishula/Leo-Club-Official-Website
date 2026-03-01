import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  createAchievementAdmin,
  createProjectAdmin,
  updateProjectAdmin,
  updateAchievementAdmin,
  deleteAchievementAdmin,
  deleteProjectAdmin,
  getCurrentSession,
  listAchievementsAdmin,
  listApplicationsAdmin,
  listProjectsAdmin,
  signInAdmin,
  signOutAdmin,
  updateApplicationAdmin,
  updateHomepageFeaturedProjects,
  listHomepageFeaturedProjects,
  updateHomepageFeaturedAchievements,
  listHomepageFeaturedAchievements,
  listBoardMembersAdmin,
  createBoardMemberAdmin,
  updateBoardMemberAdmin,
  deleteBoardMemberAdmin,
  type ApplicationStatus,
  type CmsAchievementCategory,
  type CmsAchievementRecord,
  type CmsProjectRecord,
  type MembershipApplicationRecord,
  type BoardMemberRecord,
  PROJECT_CATEGORIES,
} from '../lib/cmsApi';
import { adminEmail, isSupabaseConfigured } from '../lib/supabase';
import { uploadImage, uploadMultipleImages, generateProjectFolderName } from '../lib/storageApi';
import { DatePicker } from '../components/ui/date-picker';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

type AdminTab = 'applications' | 'projects' | 'achievements' | 'homepage' | 'homepage-achievements' | 'officers';

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
  const [boardMembers, setBoardMembers] = useState<BoardMemberRecord[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<CmsProjectRecord[]>([]);
  const [availableProjects, setAvailableProjects] = useState<CmsProjectRecord[]>([]);
  const [featuredAchievements, setFeaturedAchievements] = useState<CmsAchievementRecord[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<CmsAchievementRecord[]>([]);
  const [busyMessage, setBusyMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    completionDate: undefined as Date | undefined,
    category: '',
    description: '',
    imageUrl: '',
    galleryImagesText: '',
    isEditing: false,
  });

  const [achievementForm, setAchievementForm] = useState({
    id: '',
    category: 'project' as CmsAchievementCategory,
    title: '',
    detailsText: '',
    imageUrl: '',
    imageAlt: '',
    displayOrder: 0,
    isEditing: false,
  });

  const [boardMemberForm, setBoardMemberForm] = useState({
    id: '',
    name: '',
    role: '',
    imageUrl: '',
    bio: '',
    email: '',
    linkedin: '',
    isActive: true,
    isEditing: false,
  });

  // File upload states
  const [projectMainImage, setProjectMainImage] = useState<File | null>(null);
  const [projectGalleryImages, setProjectGalleryImages] = useState<File[]>([]);
  const [achievementImage, setAchievementImage] = useState<File | null>(null);
  const [boardMemberImage, setBoardMemberImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');

  const loadDashboardData = async () => {
    setErrorMessage('');
    try {
      const [applicationRows, projectRows, achievementRows, boardMemberRows, featuredRows, featuredAchievementRows] = await Promise.all([
        listApplicationsAdmin(),
        listProjectsAdmin(),
        listAchievementsAdmin(),
        listBoardMembersAdmin(),
        listHomepageFeaturedProjects(),
        listHomepageFeaturedAchievements(),
      ]);
      setApplications(applicationRows);
      setProjects(projectRows);
      setAchievements(achievementRows);
      setBoardMembers(boardMemberRows);
      setFeaturedProjects(featuredRows);
      setFeaturedAchievements(featuredAchievementRows);
      
      // Set available projects (all projects not currently featured)
      const featuredIds = new Set(featuredRows.map(p => p.id));
      setAvailableProjects(projectRows.filter(p => !featuredIds.has(p.id)));
      
      // Set available achievements (all achievements not currently featured)
      const featuredAchievementIds = new Set(featuredAchievementRows.map(a => a.id));
      setAvailableAchievements(achievementRows.filter(a => !featuredAchievementIds.has(a.id)));
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

  const onCreateOrUpdateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyMessage(projectForm.isEditing ? 'Updating project...' : 'Adding project...');
    setErrorMessage('');
    setUploadProgress('');
    try {
      let imageUrl = projectForm.imageUrl.trim();
      let galleryImages: string[] = [];

      console.log('Project form state:', {
        hasFile: !!projectMainImage,
        hasUrlText: !!imageUrl,
        fileName: projectMainImage?.name,
        urlValue: imageUrl
      });

      if (!projectForm.completionDate) {
        throw new Error('Please select a completion date');
      }

      if (!projectForm.category) {
        throw new Error('Please select a category');
      }

      // Check if we have either a file or URL BEFORE processing
      if (!projectMainImage && !imageUrl) {
        throw new Error('Please provide a main image (upload a file or enter a URL)');
      }

      // Format date as YYYY-MM-DD
      const formattedDate = projectForm.completionDate.toISOString().split('T')[0];

      // Generate project-specific folder name
      const projectFolder = generateProjectFolderName(projectForm.title.trim(), formattedDate);

      // Upload main image if file selected
      if (projectMainImage) {
        setUploadProgress('Uploading main image...');
        console.log('Starting upload for file:', projectMainImage.name, 'to folder:', projectFolder);
        try {
          const uploadedUrl = await uploadImage(projectMainImage, 'projects', undefined, projectFolder);
          console.log('Upload successful! URL:', uploadedUrl);
          if (uploadedUrl && uploadedUrl.trim() !== '') {
            imageUrl = uploadedUrl;
          } else {
            throw new Error('Upload returned empty URL');
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }

      // Upload gallery images if files selected
      if (projectGalleryImages.length > 0) {
        setUploadProgress(`Uploading ${projectGalleryImages.length} gallery images...`);
        galleryImages = await uploadMultipleImages(projectGalleryImages, 'projects', projectFolder);
      } else {
        // Fallback to text input
        galleryImages = projectForm.galleryImagesText
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
      }

      console.log('Final imageUrl:', imageUrl);
      console.log('Final galleryImages:', galleryImages);

      if (!imageUrl || imageUrl.trim() === '') {
        throw new Error('Image URL is empty after processing');
      }

      const data = {
        title: projectForm.title.trim(),
        category: projectForm.category.trim(),
        description: projectForm.description.trim(),
        imageUrl,
        galleryImages,
        completionDate: formattedDate,
      };

      setUploadProgress(projectForm.isEditing ? 'Updating project...' : 'Creating project...');
      if (projectForm.isEditing) {
        await updateProjectAdmin({ id: projectForm.id, ...data });
      } else {
        await createProjectAdmin(data);
      }

      // Reset form
      setProjectForm({
        id: '',
        title: '',
        completionDate: undefined,
        category: '',
        description: '',
        imageUrl: '',
        galleryImagesText: '',
        isEditing: false,
      });
      setProjectMainImage(null);
      setProjectGalleryImages([]);

      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save project.';
      setErrorMessage(message);
      console.error('Project save error:', error);
    } finally {
      setBusyMessage('');
      setUploadProgress('');
    }
  };

  const onCreateOrUpdateAchievement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyMessage(achievementForm.isEditing ? 'Updating achievement...' : 'Adding achievement...');
    setErrorMessage('');
    setUploadProgress('');
    try {
      let imageUrl = achievementForm.imageUrl.trim();

      // Upload image if file selected
      if (achievementImage) {
        setUploadProgress('Uploading image...');
        imageUrl = await uploadImage(achievementImage, 'achievements');
      }

      const details = achievementForm.detailsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

      const data = {
        category: achievementForm.category,
        title: achievementForm.title.trim(),
        details,
        imageUrl,
        imageAlt: achievementForm.imageAlt.trim(),
        displayOrder: Number(achievementForm.displayOrder || 0),
      };

      setUploadProgress(achievementForm.isEditing ? 'Updating achievement...' : 'Creating achievement...');
      if (achievementForm.isEditing) {
        await updateAchievementAdmin({ id: achievementForm.id, ...data });
      } else {
        await createAchievementAdmin(data);
      }

      // Reset form
      setAchievementForm({
        id: '',
        category: 'project',
        title: '',
        detailsText: '',
        imageUrl: '',
        imageAlt: '',
        displayOrder: 0,
        isEditing: false,
      });
      setAchievementImage(null);

      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save achievement.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
      setUploadProgress('');
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

  const onEditProject = (project: CmsProjectRecord) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      completionDate: project.completionDate ? new Date(project.completionDate) : undefined,
      category: project.category ?? '',
      description: project.description || '',
      imageUrl: project.imageUrl || '',
      galleryImagesText: Array.isArray(project.galleryImages) ? project.galleryImages.join('\n') : '',
      isEditing: true,
    });
    setProjectMainImage(null);
    setProjectGalleryImages([]);
    setActiveTab('projects');
  };

  const onCancelEditProject = () => {
    setProjectForm({
      id: '',
      title: '',
      completionDate: undefined,
      category: '',
      description: '',
      imageUrl: '',
      galleryImagesText: '',
      isEditing: false,
    });
    setProjectMainImage(null);
    setProjectGalleryImages([]);
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

  const onEditAchievement = (achievement: CmsAchievementRecord) => {
    setAchievementForm({
      id: achievement.id,
      category: achievement.category,
      title: achievement.title,
      detailsText: Array.isArray(achievement.details) ? achievement.details.join('\n') : '',
      imageUrl: achievement.imageUrl || '',
      imageAlt: achievement.imageAlt || '',
      displayOrder: achievement.displayOrder,
      isEditing: true,
    });
    setAchievementImage(null);
    setActiveTab('achievements');
  };

  const onCancelEditAchievement = () => {
    setAchievementForm({
      id: '',
      category: 'project',
      title: '',
      detailsText: '',
      imageUrl: '',
      imageAlt: '',
      displayOrder: 0,
      isEditing: false,
    });
    setAchievementImage(null);
  };

  // Homepage featured projects handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFeaturedProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addToFeatured = (project: CmsProjectRecord) => {
    if (featuredProjects.length >= 5) {
      setErrorMessage('You can only feature up to 5 projects on the homepage.');
      return;
    }
    setFeaturedProjects([...featuredProjects, project]);
    setAvailableProjects(availableProjects.filter(p => p.id !== project.id));
  };

  const removeFromFeatured = (projectId: string) => {
    const project = featuredProjects.find(p => p.id === projectId);
    if (project) {
      setFeaturedProjects(featuredProjects.filter(p => p.id !== projectId));
      setAvailableProjects([...availableProjects, project]);
    }
  };

  const saveFeaturedProjects = async () => {
    setBusyMessage('Updating homepage featured projects...');
    setErrorMessage('');
    try {
      const projectIds = featuredProjects.map(p => p.id);
      await updateHomepageFeaturedProjects(projectIds);
      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update featured projects.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
    }
  };

  // Homepage featured achievements handlers
  const handleAchievementDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFeaturedAchievements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addToFeaturedAchievements = (achievement: CmsAchievementRecord) => {
    if (featuredAchievements.length >= 3) {
      setErrorMessage('You can only feature up to 3 achievements on the homepage.');
      return;
    }
    setFeaturedAchievements([...featuredAchievements, achievement]);
    setAvailableAchievements(availableAchievements.filter(a => a.id !== achievement.id));
  };

  const removeFromFeaturedAchievements = (achievementId: string) => {
    const achievement = featuredAchievements.find(a => a.id === achievementId);
    if (achievement) {
      setFeaturedAchievements(featuredAchievements.filter(a => a.id !== achievementId));
      setAvailableAchievements([...availableAchievements, achievement]);
    }
  };

  const saveFeaturedAchievements = async () => {
    setBusyMessage('Updating homepage featured achievements...');
    setErrorMessage('');
    try {
      const achievementIds = featuredAchievements.map(a => a.id);
      await updateHomepageFeaturedAchievements(achievementIds);
      await loadDashboardData();
      alert(`Successfully updated ${achievementIds.length} featured achievement(s) on homepage!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update featured achievements.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
    }
  };

  // Board Members handlers
  const onCreateOrUpdateBoardMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyMessage(boardMemberForm.isEditing ? 'Updating board member...' : 'Adding board member...');
    setErrorMessage('');
    setUploadProgress('');
    try {
      let imageUrl = boardMemberForm.imageUrl.trim();

      // Upload image if file selected
      if (boardMemberImage) {
        setUploadProgress('Uploading image...');
        imageUrl = await uploadImage(boardMemberImage, 'board-members');
      }

      const data = {
        name: boardMemberForm.name.trim(),
        role: boardMemberForm.role.trim(),
        imageUrl,
        bio: boardMemberForm.bio.trim(),
        email: boardMemberForm.email.trim(),
        linkedin: boardMemberForm.linkedin.trim(),
        isActive: boardMemberForm.isActive,
      };

      if (boardMemberForm.isEditing) {
        await updateBoardMemberAdmin({ id: boardMemberForm.id, ...data });
      } else {
        await createBoardMemberAdmin(data);
      }

      // Reset form
      setBoardMemberForm({
        id: '',
        name: '',
        role: '',
        imageUrl: '',
        bio: '',
        email: '',
        linkedin: '',
        isActive: true,
        isEditing: false,
      });
      setBoardMemberImage(null);

      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save board member.';
      setErrorMessage(message);
    } finally {
      setBusyMessage('');
      setUploadProgress('');
    }
  };

  const onEditBoardMember = (member: BoardMemberRecord) => {
    setBoardMemberForm({
      id: member.id,
      name: member.name,
      role: member.role,
      imageUrl: member.imageUrl || '',
      bio: member.bio || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      isActive: member.isActive,
      isEditing: true,
    });
    setBoardMemberImage(null);
    setActiveTab('officers');
  };

  const onCancelEditBoardMember = () => {
    setBoardMemberForm({
      id: '',
      name: '',
      role: '',
      imageUrl: '',
      bio: '',
      email: '',
      linkedin: '',
      isActive: true,
      isEditing: false,
    });
    setBoardMemberImage(null);
  };

  const onDeleteBoardMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board member?')) return;
    setBusyMessage('Removing board member...');
    setErrorMessage('');
    try {
      await deleteBoardMemberAdmin(id);
      await loadDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove board member.';
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
          {(['homepage', 'homepage-achievements', 'applications', 'projects', 'achievements', 'officers'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-body transition-colors ${
                activeTab === tab ? 'bg-white text-slate-950' : 'bg-slate-900 text-white/75 hover:text-white'
              }`}
            >
              {tab === 'applications' ? 'Applications' 
                : tab === 'projects' ? 'Projects' 
                : tab === 'achievements' ? 'Achievements'
                : tab === 'homepage' ? 'Homepage Projects'
                : tab === 'homepage-achievements' ? 'Homepage Achievements'
                : 'Officers / Board'}
            </button>
          ))}
        </div>

        {busyMessage && (
          <div className="mb-4 rounded-md border border-blue-300/30 bg-blue-900/20 p-3 text-blue-100 text-sm">
            {busyMessage}
          </div>
        )}

        {uploadProgress && (
          <div className="mb-4 rounded-md border border-purple-300/30 bg-purple-900/20 p-3 text-purple-100 text-sm">
            📤 {uploadProgress}
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
            <form onSubmit={onCreateOrUpdateProject} className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <h2 className="text-xl font-sans font-semibold text-white">{projectForm.isEditing ? 'Edit Project' : 'Add Project'}</h2>
              <TextField label="Title" value={projectForm.title} onChange={(value) => setProjectForm((prev) => ({ ...prev, title: value }))} />
              
              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">Completion Date *</label>
                <DatePicker
                  date={projectForm.completionDate}
                  onDateChange={(date) => setProjectForm((prev) => ({ ...prev, completionDate: date }))}
                  placeholder="Select completion date"
                  className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 hover:bg-slate-950/80 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">Category *</label>
                <select
                  value={projectForm.category}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <TextAreaField label="Description" value={projectForm.description} onChange={(value) => setProjectForm((prev) => ({ ...prev, description: value }))} rows={4} />
              
              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">Main Image *</label>
                <div className="grid gap-3">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Upload Image (recommended)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        console.log('File selected:', file?.name, 'Size:', file?.size);
                        if (file) {
                          setProjectMainImage(file);
                          setProjectForm((prev) => ({ ...prev, imageUrl: '' })); // Clear URL if file selected
                        }
                      }}
                      className="w-full text-white/80 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-slate-950 file:font-semibold hover:file:bg-white/90"
                    />
                    {projectMainImage && <p className="text-green-400 text-xs mt-1">✓ {projectMainImage.name} ({Math.round(projectMainImage.size / 1024)}KB)</p>}
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Or enter URL</label>
                    <input
                      type="text"
                      value={projectForm.imageUrl}
                      onChange={(e) => {
                        setProjectForm((prev) => ({ ...prev, imageUrl: e.target.value }));
                        if (e.target.value) setProjectMainImage(null); // Clear file if URL entered
                      }}
                      placeholder="https://..."
                      className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">Gallery Images</label>
                <div className="grid gap-3">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Upload Multiple Images (recommended)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          setProjectGalleryImages(files);
                          setProjectForm((prev) => ({ ...prev, galleryImagesText: '' })); // Clear URLs if files selected
                        }
                      }}
                      className="w-full text-white/80 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-slate-950 file:font-semibold hover:file:bg-white/90"
                    />
                    {projectGalleryImages.length > 0 && (
                      <p className="text-green-400 text-xs mt-1">✓ {projectGalleryImages.length} image{projectGalleryImages.length > 1 ? 's' : ''} selected</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Or enter URLs (one per line)</label>
                    <textarea
                      value={projectForm.galleryImagesText}
                      onChange={(e) => {
                        setProjectForm((prev) => ({ ...prev, galleryImagesText: e.target.value }));
                        if (e.target.value) setProjectGalleryImages([]); // Clear files if URLs entered
                      }}
                      rows={3}
                      placeholder="https://image1.jpg&#10;https://image2.jpg"
                      className="w-full rounded-md border border-white/20 bg-slate-950/60 px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="rounded-md bg-white text-slate-950 px-4 py-2 text-sm font-semibold">
                  {projectForm.isEditing ? 'Update Project' : 'Add Project'}
                </button>
                {projectForm.isEditing && (
                  <button type="button" onClick={onCancelEditProject} className="rounded-md bg-white/10 text-white px-4 py-2 text-sm font-semibold">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-3">
              <h2 className="text-xl font-sans font-semibold text-white">Existing Projects</h2>
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-md border border-white/10 p-3">
                    <p className="text-white font-semibold">{project.title}</p>
                    <p className="text-white/60 text-xs mt-1">{project.projectId || project.dateText} • {project.category || 'General'}</p>
                    <div className="mt-2 flex gap-3">
                      <button type="button" onClick={() => onEditProject(project)} className="text-blue-300 hover:text-blue-200 text-xs">
                        Edit
                      </button>
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
            <form onSubmit={onCreateOrUpdateAchievement} className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <h2 className="text-xl font-sans font-semibold text-white">{achievementForm.isEditing ? 'Edit Achievement' : 'Add Achievement'}</h2>
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
              
              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">Achievement Image</label>
                <div className="grid gap-3">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Upload Image (recommended)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAchievementImage(file);
                          setAchievementForm((prev) => ({ ...prev, imageUrl: '' }));
                        }
                      }}
                      className="w-full text-white/80 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-slate-950 file:font-semibold hover:file:bg-white/90"
                    />
                    {achievementImage && <p className="text-green-400 text-xs mt-1">✓ {achievementImage.name}</p>}
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Or enter URL</label>
                    <input
                      type="text"
                      value={achievementForm.imageUrl}
                      onChange={(e) => {
                        setAchievementForm((prev) => ({ ...prev, imageUrl: e.target.value }));
                        if (e.target.value) setAchievementImage(null);
                      }}
                      placeholder="https://..."
                      className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <TextField label="Image Alt Text" value={achievementForm.imageAlt} onChange={(value) => setAchievementForm((prev) => ({ ...prev, imageAlt: value }))} />
              <label className="block text-white/80 text-sm">
                <span className="block mb-2">Display Order</span>
                <input
                  type="number"
                  value={achievementForm.displayOrder}
                  onChange={(event) => setAchievementForm((prev) => ({ ...prev, displayOrder: Number(event.target.value) }))}
                  className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white"
                />
              </label>
              <div className="flex gap-2">
                <button type="submit" className="rounded-md bg-white text-slate-950 px-4 py-2 text-sm font-semibold">
                  {achievementForm.isEditing ? 'Update Achievement' : 'Add Achievement'}
                </button>
                {achievementForm.isEditing && (
                  <button type="button" onClick={onCancelEditAchievement} className="rounded-md bg-white/10 text-white px-4 py-2 text-sm font-semibold">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-3">
              <h2 className="text-xl font-sans font-semibold text-white">Existing Achievements</h2>
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="rounded-md border border-white/10 p-3">
                    <p className="text-white font-semibold">{achievement.title}</p>
                    <p className="text-white/60 text-xs mt-1">{achievement.category}</p>
                    <div className="mt-2 flex gap-3">
                      <button type="button" onClick={() => onEditAchievement(achievement)} className="text-blue-300 hover:text-blue-200 text-xs">
                        Edit
                      </button>
                      <button type="button" onClick={() => onDeleteAchievement(achievement.id)} className="text-red-300 hover:text-red-200 text-xs">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && <p className="text-white/60 text-sm">No achievements yet.</p>}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'homepage' && (
          <section className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6">
              <h2 className="text-xl font-sans font-semibold text-white mb-4">Homepage Featured Projects</h2>
              <p className="text-white/60 text-sm mb-6">
                Select up to 5 projects to feature on the homepage. Drag to reorder them.
              </p>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Featured Projects - Drag and Drop */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Featured Projects ({featuredProjects.length}/5)</h3>
                    {featuredProjects.length > 0 && (
                      <button
                        type="button"
                        onClick={saveFeaturedProjects}
                        className="rounded-md bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        Save Order
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 min-h-[200px] rounded-lg border-2 border-dashed border-white/20 p-4">
                    {featuredProjects.length === 0 ? (
                      <p className="text-white/40 text-sm text-center py-8">
                        No projects selected. Add projects from the right panel.
                      </p>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={featuredProjects.map(p => p.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {featuredProjects.map((project, index) => (
                            <SortableProjectItem
                              key={project.id}
                              project={project}
                              index={index}
                              onRemove={removeFromFeatured}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </div>

                {/* Available Projects */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Available Projects</h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {availableProjects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-md border border-white/10 p-3 hover:border-white/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{project.title}</p>
                            <p className="text-white/60 text-xs mt-1">
                              {project.projectId || project.dateText} • {project.category || 'General'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToFeatured(project)}
                            disabled={featuredProjects.length >= 5}
                            className="text-green-400 hover:text-green-300 text-xs font-semibold disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                    {availableProjects.length === 0 && (
                      <p className="text-white/40 text-sm text-center py-8">
                        All projects are featured or no projects available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'homepage-achievements' && (
          <section className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6">
              <h2 className="text-xl font-sans font-semibold text-white mb-4">Homepage Featured Achievements</h2>
              <p className="text-white/60 text-sm mb-6">
                Select up to 3 achievements to feature on the homepage. Drag to reorder them.
              </p>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Featured Achievements - Drag and Drop */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Featured Achievements ({featuredAchievements.length}/3)</h3>
                    {featuredAchievements.length > 0 && (
                      <button
                        type="button"
                        onClick={saveFeaturedAchievements}
                        className="rounded-md bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        Save Order
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 min-h-[200px] rounded-lg border-2 border-dashed border-white/20 p-4">
                    {featuredAchievements.length === 0 ? (
                      <p className="text-white/40 text-sm text-center py-8">
                        No achievements selected. Add achievements from the right panel.
                      </p>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleAchievementDragEnd}
                      >
                        <SortableContext
                          items={featuredAchievements.map(a => a.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {featuredAchievements.map((achievement, index) => (
                            <SortableAchievementItem
                              key={achievement.id}
                              achievement={achievement}
                              index={index}
                              onRemove={removeFromFeaturedAchievements}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </div>

                {/* Available Achievements */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Available Achievements</h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {availableAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="rounded-md border border-white/10 p-3 hover:border-white/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{achievement.title}</p>
                            <p className="text-white/60 text-xs mt-1">
                              {achievement.category === 'project' ? 'Project Award' 
                                : achievement.category === 'individual' ? 'Individual Award'
                                : 'Special Recognition'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToFeaturedAchievements(achievement)}
                            disabled={featuredAchievements.length >= 3}
                            className="text-green-400 hover:text-green-300 text-xs font-semibold disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                    {availableAchievements.length === 0 && (
                      <p className="text-white/40 text-sm text-center py-8">
                        All achievements are featured or no achievements available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'officers' && (
          <section className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={onCreateOrUpdateBoardMember} className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-sans font-semibold text-white">
                  {boardMemberForm.isEditing ? 'Edit Officer / Board Member' : 'Add Officer / Board Member'}
                </h2>
                {boardMemberForm.isEditing && (
                  <button
                    type="button"
                    onClick={onCancelEditBoardMember}
                    className="text-white/60 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <TextField 
                label="Name *" 
                value={boardMemberForm.name} 
                onChange={(value) => setBoardMemberForm((prev) => ({ ...prev, name: value }))} 
              />
              
              <TextField 
                label="Role / Position *" 
                value={boardMemberForm.role} 
                onChange={(value) => setBoardMemberForm((prev) => ({ ...prev, role: value }))} 
              />

              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">Profile Image</label>
                <div className="grid gap-3">
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Upload Image (recommended)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBoardMemberImage(file);
                          setBoardMemberForm((prev) => ({ ...prev, imageUrl: '' }));
                        }
                      }}
                      className="w-full text-white/80 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-slate-950 file:font-semibold hover:file:bg-white/90"
                    />
                    {boardMemberImage && <p className="text-green-400 text-xs mt-1">✓ {boardMemberImage.name}</p>}
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Or enter URL</label>
                    <input
                      type="text"
                      value={boardMemberForm.imageUrl}
                      onChange={(e) => {
                        setBoardMemberForm((prev) => ({ ...prev, imageUrl: e.target.value }));
                        if (e.target.value) setBoardMemberImage(null);
                      }}
                      placeholder="https://..."
                      className="w-full h-10 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <TextAreaField 
                label="Bio (optional)" 
                value={boardMemberForm.bio} 
                onChange={(value) => setBoardMemberForm((prev) => ({ ...prev, bio: value }))} 
                rows={3} 
              />

              <TextField 
                label="Email (optional)" 
                value={boardMemberForm.email} 
                onChange={(value) => setBoardMemberForm((prev) => ({ ...prev, email: value }))} 
              />

              <TextField 
                label="LinkedIn URL (optional)" 
                value={boardMemberForm.linkedin} 
                onChange={(value) => setBoardMemberForm((prev) => ({ ...prev, linkedin: value }))} 
              />

              <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                <input
                  type="checkbox"
                  checked={boardMemberForm.isActive}
                  onChange={(event) => setBoardMemberForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                />
                Active
              </label>

              <button type="submit" className="rounded-md bg-white text-slate-950 px-4 py-2 text-sm font-semibold">
                {boardMemberForm.isEditing ? 'Update' : 'Add'} Board Member
              </button>
            </form>

            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-3">
              <h2 className="text-xl font-sans font-semibold text-white">Existing Board Members</h2>
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {boardMembers.map((member) => (
                  <div key={member.id} className="rounded-md border border-white/10 p-3">
                    <div className="flex items-start gap-3">
                      {member.imageUrl && (
                        <img 
                          src={member.imageUrl} 
                          alt={member.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-semibold">{member.name}</p>
                        <p className="text-white/60 text-xs mt-1">{member.role}</p>
                        {!member.isActive && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-red-900/30 text-red-300 text-xs rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => onEditBoardMember(member)} 
                        className="text-blue-300 hover:text-blue-200 text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => onDeleteBoardMember(member.id)} 
                        className="text-red-300 hover:text-red-200 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {boardMembers.length === 0 && <p className="text-white/60 text-sm">No board members yet.</p>}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// Sortable Project Item Component
function SortableProjectItem({
  project,
  index,
  onRemove,
}: {
  project: CmsProjectRecord;
  index: number;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border border-white/20 bg-slate-800/50 p-3 flex items-center gap-3"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-white/40 hover:text-white/60 transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-950 text-xs font-bold">
            {index + 1}
          </span>
          <p className="text-white font-semibold truncate">{project.title}</p>
        </div>
        <p className="text-white/60 text-xs mt-1">
          {project.projectId || project.dateText} • {project.category || 'General'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(project.id)}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// Sortable Achievement Item Component
function SortableAchievementItem({
  achievement,
  index,
  onRemove,
}: {
  achievement: CmsAchievementRecord;
  index: number;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: achievement.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border border-white/20 bg-slate-800/50 p-3 flex items-center gap-3"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-white/40 hover:text-white/60 transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-950 text-xs font-bold">
            {index + 1}
          </span>
          <p className="text-white font-semibold truncate">{achievement.title}</p>
        </div>
        <p className="text-white/60 text-xs mt-1">
          {achievement.category === 'project' ? 'Project Award' 
            : achievement.category === 'individual' ? 'Individual Award'
            : 'Special Recognition'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(achievement.id)}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
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
