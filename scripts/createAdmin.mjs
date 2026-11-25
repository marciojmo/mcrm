import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { hashPassword } from 'better-auth/crypto';

const [email, name, password] = process.argv.slice(2);
if (!email || !name || !password) {
  console.error('Usage: npm run create-admin -- <email> <name> <password>');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must have at least 8 characters.');
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query('BEGIN');
  const normalizedEmail = email.trim().toLowerCase();
  const found = await client.query(
    'SELECT id FROM users WHERE lower(email) = $1',
    [normalizedEmail]
  );
  const userId = found.rows[0]?.id ?? randomUUID();
  if (found.rows.length === 0) {
    await client.query(
      `INSERT INTO users (id, name, email, email_verified, role, updated_at)
       VALUES ($1, $2, $3, true, 'admin', now())`,
      [userId, name, normalizedEmail]
    );
  } else {
    await client.query(
      "UPDATE users SET role = 'admin', updated_at = now() WHERE id = $1",
      [userId]
    );
  }
  const passwordHash = await hashPassword(password);
  const updated = await client.query(
    `UPDATE accounts SET password = $1, updated_at = now()
     WHERE user_id = $2 AND provider_id = 'credential'`,
    [passwordHash, userId]
  );
  if (updated.rowCount === 0) {
    await client.query(
      `INSERT INTO accounts (id, account_id, provider_id, user_id, password, updated_at)
       VALUES ($1, $2, 'credential', $2, $3, now())`,
      [randomUUID(), userId, passwordHash]
    );
  }
  await client.query('COMMIT');
  process.stdout.write(`Admin ready: ${normalizedEmail}\n`);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}
