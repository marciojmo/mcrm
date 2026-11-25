import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { isContentLengthAllowed } from '@/lib/uploadPolicy';
import { getMaxUploadBytes } from '@/services/appSettingService';
import { addFileAttachment } from '@/services/attachmentService';
import { assertTaskAccess } from '@/services/boardAccessService';
import { getSession } from '@/services/sessionService';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const maxUploadBytes = await getMaxUploadBytes();
  if (
    !isContentLengthAllowed(
      request.headers.get('content-length'),
      maxUploadBytes
    )
  ) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }
  const form = await request.formData();
  const taskId = form.get('taskId');
  const file = form.get('file');
  if (typeof taskId !== 'string' || !(file instanceof File)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  try {
    await assertTaskAccess(session.user.id, taskId);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (file.size > maxUploadBytes) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }
  await addFileAttachment(taskId, file);
  revalidatePath('/dashboard', 'layout');
  return NextResponse.json({ ok: true });
}
