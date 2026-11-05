import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR } from '@/constants/storage';

export async function saveFile(file: File) {
  const storedName = randomUUID();
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(
    path.join(UPLOADS_DIR, storedName),
    Buffer.from(await file.arrayBuffer())
  );
  return storedName;
}

export async function readStoredFile(storedName: string) {
  return readFile(path.join(UPLOADS_DIR, storedName));
}

export async function removeStoredFile(storedName: string) {
  await rm(path.join(UPLOADS_DIR, storedName), { force: true });
}
