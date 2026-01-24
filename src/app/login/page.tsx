import { AuthCard } from "@/components/auth/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <AuthCard mode="login" />
      </div>
    </div>
  );
}
