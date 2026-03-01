import { useEffect, useState } from 'react';
import { listHomepageFeaturedProjects, listProjectsPublic, type CmsProjectRecord } from '@/lib/cmsApi';
import type { Project } from '@/config';

function mapToProject(record: CmsProjectRecord): Project {
  return {
    id: record.id,
    title: record.title,
    dateText: record.dateText,
    imageUrl: record.imageUrl,
    description: record.description,
    category: record.category || undefined,
    galleryImages: record.galleryImages,
    isFeatured: record.isFeatured,
    displayOrder: record.displayOrder,
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await listProjectsPublic();
        setProjects(data.map(mapToProject));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

export function useFeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        setLoading(true);
        const data = await listHomepageFeaturedProjects();
        setProjects(data.map(mapToProject));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch featured projects'));
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProjects();
  }, []);

  return { projects, loading, error };
}
