function readRequired(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function readList(name: string) {
  return (process.env[name] ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function readTimeZone(name: string) {
  const value = process.env[name] || 'America/Sao_Paulo';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
  } catch {
    throw new Error(`Invalid time zone in ${name}: ${value}`);
  }
  return value;
}

export const env = Object.freeze({
  DATABASE_URL: readRequired('DATABASE_URL'),
  BETTER_AUTH_SECRET: readRequired('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: readRequired('BETTER_AUTH_URL'),
  GOOGLE_CLIENT_ID: readRequired('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: readRequired('GOOGLE_CLIENT_SECRET'),
  GOOGLE_WORKSPACE_DOMAIN: readRequired('GOOGLE_WORKSPACE_DOMAIN'),
  ADMIN_EMAILS: readList('ADMIN_EMAILS'),
  APP_TIME_ZONE: readTimeZone('APP_TIME_ZONE'),
  S3_ENDPOINT: readRequired('S3_ENDPOINT'),
  S3_REGION: readRequired('S3_REGION'),
  S3_BUCKET: readRequired('S3_BUCKET'),
  S3_ACCESS_KEY_ID: readRequired('S3_ACCESS_KEY_ID'),
  S3_SECRET_ACCESS_KEY: readRequired('S3_SECRET_ACCESS_KEY'),
});
