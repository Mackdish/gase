import { AuthCard } from "@/components/auth/AuthCard";

export default function RegisterPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <AuthCard mode="register" />
      </div>
    </div>
  );
}
