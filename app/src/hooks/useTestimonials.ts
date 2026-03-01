import { useEffect, useState } from 'react';
import { listTestimonialsPublic } from '@/lib/cmsApi';
import type { Testimonial } from '@/config';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true);
        const data = await listTestimonialsPublic();
        setTestimonials(data as Testimonial[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch testimonials'));
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
}
