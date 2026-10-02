// `prisma generate` validates the schema and fails if DATABASE_URL/DIRECT_URL are
// unset, even though it never connects. In demo mode we pass placeholders to this
// one command only; the app itself still sees no DATABASE_URL and stays in demo mode.
import { execSync } from "node:child_process";

const placeholder = "postgresql://demo:demo@localhost:5432/demo";
const env = { ...process.env };
env.DATABASE_URL ||= placeholder;
env.DIRECT_URL ||= env.DATABASE_URL;

execSync("npx prisma generate", { stdio: "inherit", env });
