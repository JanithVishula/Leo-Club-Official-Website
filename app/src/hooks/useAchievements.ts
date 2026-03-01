import { useEffect, useState } from 'react';
import { listAchievementsPublic, listHomepageFeaturedAchievements, type CmsAchievementRecord } from '@/lib/cmsApi';
import type { Achievement } from '@/config';

function mapToAchievement(record: CmsAchievementRecord): Achievement {
  return {
    id: record.id,
    category: record.category,
    title: record.title,
    details: record.details,
    imageUrl: record.imageUrl,
    imageAlt: record.imageAlt,
    displayOrder: record.displayOrder,
  };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        setLoading(true);
        const data = await listAchievementsPublic();
        setAchievements(data.map(mapToAchievement));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch achievements'));
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  return { achievements, loading, error };
}

export function useFeaturedAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFeaturedAchievements() {
      try {
        setLoading(true);
        const data = await listHomepageFeaturedAchievements();
        setAchievements(data.map(mapToAchievement));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch featured achievements'));
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedAchievements();
  }, []);

  return { achievements, loading, error };
}
