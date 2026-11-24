import { randomUUID } from 'node:crypto';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { env } from '@/config/env';

const client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export async function saveFile(file: File, contentType: string) {
  const storedName = randomUUID();
  await client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: storedName,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: contentType,
    })
  );
  return storedName;
}

export async function readStoredFile(storedName: string) {
  const { Body } = await client.send(
    new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: storedName })
  );
  if (!Body) throw new Error(`Empty object: ${storedName}`);
  return Buffer.from(await Body.transformToByteArray());
}

export async function removeStoredFile(storedName: string) {
  await client.send(
    new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: storedName })
  );
}
