/**
 * Demo mode: active when DATABASE_URL is not set. The public site renders from
 * the seed content in code, ordering and inquiries are disabled, and the admin
 * panel is closed. Set DATABASE_URL to switch to the real database.
 */
export const IS_DEMO = !process.env.DATABASE_URL;
