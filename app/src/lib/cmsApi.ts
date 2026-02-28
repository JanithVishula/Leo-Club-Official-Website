import type { Session } from '@supabase/supabase-js';
import { adminEmail, isSupabaseConfigured, supabase } from './supabase';

export type ApplicationStatus = 'new' | 'reviewing' | 'accepted' | 'rejected';

export interface MembershipApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  organization?: string;
  motivation: string;
  consent: boolean;
}

export interface MembershipApplicationRecord extends MembershipApplicationInput {
  id: string;
  status: ApplicationStatus;
  adminNotes: string | null;
  reviewedAt: string | null;
  reviewerEmail: string | null;
  createdAt: string;
}

export interface CmsProjectRecord {
  id: string;
  title: string;
  dateText: string;
  category: string | null;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
}

export type CmsAchievementCategory = 'project' | 'individual' | 'special';

export interface CmsAchievementRecord {
  id: string;
  category: CmsAchievementCategory;
  title: string;
  details: string[];
  imageUrl: string | null;
  imageAlt: string | null;
  displayOrder: number;
  createdAt: string;
}

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
}

function ensureAdminSession(session: Session | null) {
  if (!session?.user?.email) throw new Error('Admin session required.');
  if (!adminEmail || session.user.email.toLowerCase() !== adminEmail) {
    throw new Error('Only the configured admin account can perform this action.');
  }
}

export async function submitMembershipApplication(input: MembershipApplicationInput) {
  assertConfigured();
  const payload = {
    full_name: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    age: input.age,
    organization: input.organization?.trim() || null,
    motivation: input.motivation.trim(),
    consent: input.consent,
    status: 'new' as ApplicationStatus,
  };

  const { error } = await supabase!.from('membership_applications').insert(payload);
  if (error) throw new Error(error.message);
}

export async function signInAdmin(email: string, password: string) {
  assertConfigured();
  const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user?.email || data.user.email.toLowerCase() !== adminEmail) {
    await supabase!.auth.signOut();
    throw new Error('This account is not allowed to access admin dashboard.');
  }
  return data.session;
}

export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

function mapApplicationRow(row: Record<string, unknown>): MembershipApplicationRecord {
  return {
    id: String(row.id),
    fullName: String(row.full_name ?? ''),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    age: Number(row.age ?? 0),
    organization: (row.organization as string | null) ?? undefined,
    motivation: String(row.motivation ?? ''),
    consent: Boolean(row.consent),
    status: (row.status as ApplicationStatus) || 'new',
    adminNotes: (row.admin_notes as string | null) ?? null,
    reviewedAt: (row.reviewed_at as string | null) ?? null,
    reviewerEmail: (row.reviewer_email as string | null) ?? null,
    createdAt: String(row.created_at ?? ''),
  };
}

function mapProjectRow(row: Record<string, unknown>): CmsProjectRecord {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    dateText: String(row.date_text ?? ''),
    category: (row.category as string | null) ?? null,
    description: String(row.description ?? ''),
    imageUrl: String(row.image_url ?? ''),
    galleryImages: Array.isArray(row.gallery_images)
      ? row.gallery_images.map((item) => String(item))
      : [],
    isFeatured: Boolean(row.is_featured),
    displayOrder: Number(row.display_order ?? 0),
    createdAt: String(row.created_at ?? ''),
  };
}

function mapAchievementRow(row: Record<string, unknown>): CmsAchievementRecord {
  return {
    id: String(row.id),
    category: (row.category as CmsAchievementCategory) || 'project',
    title: String(row.title ?? ''),
    details: Array.isArray(row.details) ? row.details.map((item) => String(item)) : [],
    imageUrl: (row.image_url as string | null) ?? null,
    imageAlt: (row.image_alt as string | null) ?? null,
    displayOrder: Number(row.display_order ?? 0),
    createdAt: String(row.created_at ?? ''),
  };
}

export async function listApplicationsAdmin() {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);

  const { data, error } = await supabase!
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapApplicationRow(row as Record<string, unknown>));
}

export async function updateApplicationAdmin(input: {
  id: string;
  status: ApplicationStatus;
  adminNotes: string;
}) {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);

  const { error } = await supabase!
    .from('membership_applications')
    .update({
      status: input.status,
      admin_notes: input.adminNotes,
      reviewed_at: new Date().toISOString(),
      reviewer_email: session!.user.email,
    })
    .eq('id', input.id);
  if (error) throw new Error(error.message);
}

export async function listProjectsPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => mapProjectRow(row as Record<string, unknown>));
}

export async function listProjectsAdmin() {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);
  return listProjectsPublic();
}

export async function createProjectAdmin(input: {
  title: string;
  dateText: string;
  category: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  isFeatured: boolean;
  displayOrder: number;
}) {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);
  const { error } = await supabase!.from('projects').insert({
    title: input.title,
    date_text: input.dateText,
    category: input.category || null,
    description: input.description,
    image_url: input.imageUrl,
    gallery_images: input.galleryImages,
    is_featured: input.isFeatured,
    display_order: input.displayOrder,
  });
  if (error) throw new Error(error.message);
}

export async function deleteProjectAdmin(id: string) {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);
  const { error } = await supabase!.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listAchievementsPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => mapAchievementRow(row as Record<string, unknown>));
}

export async function listAchievementsAdmin() {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);
  return listAchievementsPublic();
}

export async function createAchievementAdmin(input: {
  category: CmsAchievementCategory;
  title: string;
  details: string[];
  imageUrl?: string;
  imageAlt?: string;
  displayOrder: number;
}) {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);
  const { error } = await supabase!.from('achievements').insert({
    category: input.category,
    title: input.title,
    details: input.details,
    image_url: input.imageUrl?.trim() || null,
    image_alt: input.imageAlt?.trim() || null,
    display_order: input.displayOrder,
  });
  if (error) throw new Error(error.message);
}

export async function deleteAchievementAdmin(id: string) {
  assertConfigured();
  const session = await getCurrentSession();
  ensureAdminSession(session);
  const { error } = await supabase!.from('achievements').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
// =========================
// FULL CMS API FUNCTIONS
// =========================

// Board Members
export async function listBoardMembersPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('board_members')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) return [];
  return data ?? [];
}

// Testimonials
export async function listTestimonialsPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) return [];
  return data ?? [];
}

// FAQs
export async function listFaqsPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) return [];
  return data ?? [];
}

// Services
export async function listServicesPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) return [];
  return data ?? [];
}

// Feature Cards
export async function listFeatureCardsPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('feature_cards')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) return [];
  return data ?? [];
}

// Portfolio Images
export async function listPortfolioImagesPublic() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('portfolio_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true});
  if (error) return [];
  return data ?? [];
}

// Site Settings
export async function getSiteSettingPublic(key: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();
  if (error) return null;
  return data?.value ?? null;
}

export async function listAllSiteSettingsPublic() {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');
  if (error) return {};
  
  const settings: Record<string, any> = {};
  (data ?? []).forEach(row => {
    settings[row.key] = row.value;
  });
  return settings;
}