import type { TaskAttachment } from '@/types/task';

const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const DRIVE_FILE_ID = /\/d\/([\w-]+)/;

export function getDriveFileId(url: string) {
  const link = new URL(url);
  return DRIVE_FILE_ID.exec(link.pathname)?.[1] ?? link.searchParams.get('id');
}

export function getImageUrl(attachment: TaskAttachment) {
  if (!attachment.url) {
    return attachment.mimeType?.startsWith('image/')
      ? `/api/attachments/${attachment.id}`
      : null;
  }
  return IMAGE_EXTENSION.test(new URL(attachment.url).pathname)
    ? attachment.url
    : null;
}

export function getPreviewUrl(attachment: TaskAttachment) {
  const imageUrl = getImageUrl(attachment);
  if (imageUrl) return imageUrl;
  if (!attachment.url) return null;
  const link = new URL(attachment.url);
  const driveFileId =
    link.hostname === 'drive.google.com'
      ? getDriveFileId(attachment.url)
      : null;
  return driveFileId
    ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w200`
    : null;
}
