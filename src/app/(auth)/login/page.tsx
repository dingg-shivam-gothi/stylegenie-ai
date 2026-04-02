import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign In — StyleGenie AI",
  description: "Sign in to your StyleGenie AI account and continue your style transformation journey.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <AuthForm mode="login" />
    </main>
  );
}
