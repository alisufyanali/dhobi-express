import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  if (!process.env.DATABASE_URL || !process.env.NEXTAUTH_SECRET) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
        <div className="card max-w-sm p-6 text-center">
          <h1 className="text-xl font-bold">Admin is off in demo mode</h1>
          <p className="mt-2 text-sm text-slate-600">Set DATABASE_URL, DIRECT_URL and NEXTAUTH_SECRET in Vercel, redeploy, and run the seed to create your admin login.</p>
        </div>
      </div>
    );
  }
  return <LoginForm />;
}
