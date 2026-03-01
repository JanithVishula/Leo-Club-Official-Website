import { useEffect, useState } from 'react';
import { listFaqsPublic } from '@/lib/cmsApi';
import type { FAQItem } from '@/config';

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);
        const data = await listFaqsPublic();
        setFaqs(data as FAQItem[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch FAQs'));
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  return { faqs, loading, error };
}
