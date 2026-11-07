import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { MAX_UPLOAD_BYTES } from '@/constants/storage';
import { addFileAttachment } from '@/services/attachmentService';
import { getSession } from '@/services/sessionService';

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const form = await request.formData();
  const taskId = form.get('taskId');
  const file = form.get('file');
  if (typeof taskId !== 'string' || !(file instanceof File)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }
  await addFileAttachment(taskId, file);
  revalidatePath('/dashboard', 'layout');
  return NextResponse.json({ ok: true });
}
