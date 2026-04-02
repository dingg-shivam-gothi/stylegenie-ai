import type { Metadata } from "next";
import { AnalyzeClient } from "@/components/analyze/analyze-client";

export const metadata: Metadata = {
  title: "Analyze Your Look | StyleGenie AI",
  description:
    "Upload your photo and get AI-powered style and beauty recommendations.",
};

export default function AnalyzePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-white">
          Analyze Your Look
        </h1>
        <AnalyzeClient />
      </div>
    </div>
  );
}
