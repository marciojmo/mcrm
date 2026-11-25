import {
  ALLOWED_MIME_TYPES,
  FALLBACK_MIME_TYPE,
  MAX_FILE_NAME_LENGTH,
  MAX_MULTIPART_OVERHEAD_BYTES,
} from '@/constants/storage';

const MAX_EXTENSION_LENGTH = 16;

export function isContentLengthAllowed(
  header: string | null,
  maxUploadBytes: number
) {
  if (!header || !/^\d+$/.test(header)) return false;
  return Number(header) <= maxUploadBytes + MAX_MULTIPART_OVERHEAD_BYTES;
}

export function sanitizeMimeType(mimeType: string | null | undefined) {
  const normalized = mimeType?.toLowerCase() ?? '';
  return ALLOWED_MIME_TYPES.has(normalized) ? normalized : FALLBACK_MIME_TYPE;
}

export function sanitizeFileName(name: string) {
  const chars = Array.from(name);
  if (chars.length <= MAX_FILE_NAME_LENGTH) return name;
  const extension = /\.[^.]+$/.exec(name)?.[0] ?? '';
  const keptExtension =
    extension.length <= MAX_EXTENSION_LENGTH ? Array.from(extension) : [];
  const base = chars.slice(0, MAX_FILE_NAME_LENGTH - keptExtension.length);
  return [...base, ...keptExtension].join('');
}
