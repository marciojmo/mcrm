import { prisma } from '@/lib/prisma';
import { sanitizeFileName, sanitizeMimeType } from '@/lib/uploadPolicy';
import { removeStoredFile, saveFile } from '@/services/fileStorage';

export async function addLinkAttachment(
  taskId: string,
  url: string,
  name: string
) {
  return prisma.attachment.create({ data: { taskId, url, name } });
}

export async function addFileAttachment(taskId: string, file: File) {
  const mimeType = sanitizeMimeType(file.type);
  const storedName = await saveFile(file, mimeType);
  try {
    return await prisma.attachment.create({
      data: {
        taskId,
        storedName,
        name: sanitizeFileName(file.name),
        mimeType,
        size: file.size,
      },
    });
  } catch (error) {
    await removeStoredFile(storedName);
    throw error;
  }
}

export async function getAttachment(attachmentId: string) {
  return prisma.attachment.findUnique({ where: { id: attachmentId } });
}

export async function deleteAttachment(attachmentId: string) {
  const attachment = await prisma.attachment.delete({
    where: { id: attachmentId },
  });
  if (attachment.storedName) await removeStoredFile(attachment.storedName);
}
