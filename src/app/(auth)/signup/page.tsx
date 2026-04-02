import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign Up — StyleGenie AI",
  description: "Create your StyleGenie AI account and start your AI-powered beauty analysis.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <AuthForm mode="signup" />
    </main>
  );
}
