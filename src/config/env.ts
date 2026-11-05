function readRequired(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = Object.freeze({
  DATABASE_URL: readRequired('DATABASE_URL'),
});
