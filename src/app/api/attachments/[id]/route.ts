import { NextResponse } from 'next/server';
import { getAttachment } from '@/services/attachmentService';
import { assertAttachmentReadAccess } from '@/services/boardAccessService';
import { readStoredFile } from '@/services/fileStorage';
import { getSession } from '@/services/sessionService';

export async function GET(
  _request: Request,
  { params }: RouteContext<'/api/attachments/[id]'>
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    await assertAttachmentReadAccess(session.user.id, id);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const attachment = await getAttachment(id);
  if (!attachment?.storedName) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return new NextResponse(await readStoredFile(attachment.storedName), {
    headers: {
      'Content-Type': attachment.mimeType ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(attachment.name)}`,
    },
  });
}
