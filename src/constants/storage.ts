export const BYTES_PER_MB = 1024 * 1024;
export const DEFAULT_MAX_UPLOAD_BYTES = 10 * BYTES_PER_MB;
export const MIN_UPLOAD_MB = 1;
export const MAX_UPLOAD_MB = 50;
export const MAX_MULTIPART_OVERHEAD_BYTES = 64 * 1024;
export const MAX_FILE_NAME_LENGTH = 255;
export const FALLBACK_MIME_TYPE = 'application/octet-stream';
export const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/json',
  'application/zip',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.oasis.opendocument.presentation',
]);
