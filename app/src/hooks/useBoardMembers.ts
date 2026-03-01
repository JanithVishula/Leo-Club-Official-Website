import { useEffect, useState } from 'react';
import { listBoardMembersPublic, type BoardMemberRecord } from '@/lib/cmsApi';
import type { BoardMember } from '@/config';

function mapToBoardMember(record: BoardMemberRecord): BoardMember {
  return {
    id: record.id,
    name: record.name,
    role: record.role,
    imageUrl: record.imageUrl,
    bio: record.bio,
    email: record.email,
    linkedin: record.linkedin,
    displayOrder: record.displayOrder,
    isActive: record.isActive,
  };
}

export function useBoardMembers() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBoardMembers() {
      try {
        setLoading(true);
        const data = await listBoardMembersPublic();
        setBoardMembers(data.map(mapToBoardMember));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch board members'));
      } finally {
        setLoading(false);
      }
    }

    fetchBoardMembers();
  }, []);

  return { boardMembers, loading, error };
}
