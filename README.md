# MCRM

**An open-source, self-hosted alternative to Trello.** Organize work in panels and tasks, collaborate through comments and mentions, and sign in with your Google Workspace.

> Found a bug or have an idea? [Open an issue](https://github.com/marciojmo/mcrm/issues).

## 🚀 Getting started

MCRM is a Next.js app backed by PostgreSQL. You will need:

- [Node.js](https://nodejs.org) 20.9 or later
- [Docker](https://www.docker.com) (for the local PostgreSQL database), or any PostgreSQL 17 instance
- A Google Workspace OAuth client (see [Google sign-in](#google-sign-in))

### 1. Clone and install

```bash
git clone git@github.com:marciojmo/mcrm.git
cd mcrm
npm install
```

### 2. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with user `postgres`, password `postgres` and database `mcrm`.

### 3. Configure the environment

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable                  | Description                                                                 | Example                                              |
| ------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string                                                | `postgresql://postgres:postgres@localhost:5432/mcrm` |
| `BETTER_AUTH_SECRET`      | Random secret used to sign sessions (`openssl rand -base64 32`)             | —                                                    |
| `BETTER_AUTH_URL`         | Public URL of the app                                                       | `http://localhost:3100`                              |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID                                                      | —                                                    |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret                                                  | —                                                    |
| `GOOGLE_WORKSPACE_DOMAIN` | Only accounts from this Google Workspace domain can sign in (without the @) | `example.com`                                        |

All variables are required. The app fails on startup if one is missing.

### 4. Apply the database migrations

```bash
npx prisma migrate deploy
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3100](http://localhost:3100) and sign in with your Google Workspace account. The first sign-in creates your user.

## Google sign-in

MCRM only supports Google Workspace sign-in. To create the credentials:

1. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth client ID** of type **Web application**.
2. Add this **Authorized redirect URI** (replace the host with your `BETTER_AUTH_URL`):

   ```
   http://localhost:3100/api/auth/callback/google
   ```

3. Copy the client ID and secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. Set `GOOGLE_WORKSPACE_DOMAIN` to your organization's domain.

## 🌟 Features

- **Panels and tasks**: create panels, add tasks and drag them between panels.
- **Task details**: description, due date, labels, members, checklists and attachments (uploaded files or Google Drive links).
- **Comments and mentions**: mention teammates with `@`.
- **Home**: your pending and completed tasks, your three tightest deadlines, and your mentions. Clicking a mention opens the task and highlights the comment.
- **Follow, duplicate and archive** tasks from the task menu.
- **Archive panels** you no longer need.

## 🏭 Production

```bash
npm run build
npm run start
```

Set `BETTER_AUTH_URL` to your public URL and add the matching redirect URI in Google Cloud. Run `npx prisma migrate deploy` on every release. Uploaded attachments are stored on disk in the `uploads/` directory, so keep it on persistent storage.

## 🛠️ Local development

| Command                           | What it does                                               |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Start the dev server on port 3100                          |
| `npm run check`                   | Lint, typecheck and formatting (must pass before a PR)     |
| `npx prisma migrate dev --name x` | Create and apply a migration after editing `schema.prisma` |
| `npx prisma studio`               | Browse the database                                        |

Project conventions live in [AGENTS.md](AGENTS.md).

## ⚙️ Built with

[Next.js](https://nextjs.org) (App Router) · [React](https://react.dev) · TypeScript · [Prisma](https://www.prisma.io) · PostgreSQL · [Better Auth](https://www.better-auth.com) · [Tailwind CSS](https://tailwindcss.com) · [Base UI](https://base-ui.com) · [dnd kit](https://dndkit.com)

## 🤝 Contributing

Contributions are welcome:

- Report bugs and request features through [issues](https://github.com/marciojmo/mcrm/issues)
- Improve the documentation
- Send a pull request. Run `npm run check` first.
