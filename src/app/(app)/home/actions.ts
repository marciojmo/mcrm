'use server';

import { revalidatePath } from 'next/cache';
import { markMentionSeen as markMentionSeenRecord } from '@/services/commentService';
import { requireSession } from '@/services/sessionService';

export async function markMentionSeen(commentId: string) {
  const { user } = await requireSession();
  await markMentionSeenRecord(commentId, user.id);
  revalidatePath('/home');
}
