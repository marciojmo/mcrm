import { prisma } from '@/lib/prisma';
import { removeStoredFile, saveFile } from '@/services/fileStorage';

export async function addLinkAttachment(
  taskId: string,
  url: string,
  name: string
) {
  return prisma.attachment.create({ data: { taskId, url, name } });
}

export async function addFileAttachment(taskId: string, file: File) {
  const storedName = await saveFile(file);
  return prisma.attachment.create({
    data: {
      taskId,
      storedName,
      name: file.name,
      mimeType: file.type || null,
      size: file.size,
    },
  });
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
