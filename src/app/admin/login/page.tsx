import { AuthCard } from "@/components/auth/AuthCard";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const reason = typeof searchParams?.reason === "string" ? searchParams?.reason : "";

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          {reason === "forbidden" ? (
            <div className="rounded-2xl border border-orange-500/20 bg-orange-50 px-4 py-3 text-sm text-orange-800 dark:border-orange-500/30 dark:bg-orange-950/20 dark:text-orange-200">
              Admin access required. Please sign in with an admin account.
            </div>
          ) : reason === "login" ? (
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
              Please sign in to access the admin dashboard.
            </div>
          ) : null}

          <AuthCard mode="login" />
        </div>
      </div>
    </div>
  );
}
