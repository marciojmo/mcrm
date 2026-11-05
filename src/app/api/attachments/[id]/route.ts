import { NextResponse } from 'next/server';
import { getAttachment } from '@/services/attachmentService';
import { readStoredFile } from '@/services/fileStorage';
import { getSession } from '@/services/sessionService';

export async function GET(
  _request: Request,
  { params }: RouteContext<'/api/attachments/[id]'>
) {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
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
