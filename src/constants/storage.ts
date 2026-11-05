import path from 'node:path';

export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
