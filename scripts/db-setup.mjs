// Runs during `npm run build` (on Vercel too).
// - No DATABASE_URL  → skip (demo mode).
// - With DATABASE_URL → sync the schema to the database, then seed.
// `prisma db push` refuses changes that would delete data, so a risky schema
// change fails the build instead of silently wiping tables.
// The seed only adds missing rows, so running it on every deploy is safe.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[db-setup] No DATABASE_URL — demo mode, skipping database setup.");
  process.exit(0);
}

const run = (cmd) => execSync(cmd, { stdio: "inherit" });
console.log("[db-setup] Syncing schema…");
if (!process.env.DIRECT_URL) process.env.DIRECT_URL = process.env.DATABASE_URL;
run("npx prisma db push --skip-generate");
console.log("[db-setup] Seeding…");
run("npx tsx prisma/seed.ts");
