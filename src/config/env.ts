function readRequired(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = Object.freeze({
  DATABASE_URL: readRequired('DATABASE_URL'),
  BETTER_AUTH_SECRET: readRequired('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: readRequired('BETTER_AUTH_URL'),
  GOOGLE_CLIENT_ID: readRequired('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: readRequired('GOOGLE_CLIENT_SECRET'),
  GOOGLE_WORKSPACE_DOMAIN: readRequired('GOOGLE_WORKSPACE_DOMAIN'),
});
