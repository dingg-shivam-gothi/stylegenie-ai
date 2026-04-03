"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoUpload } from "@/components/analyze/photo-upload";
import { PreferencesForm } from "@/components/analyze/preferences-form";
import { AnalysisLoading } from "@/components/analyze/analysis-loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Step = "upload" | "preferences" | "analyzing" | "results";

export function AnalyzeClient() {
  const [step, setStep] = useState<Step>("upload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    setStep("preferences");
  };

  const handlePreferencesComplete = async (prefs: Record<string, unknown>) => {
    setPreferences(prefs);
    setError(null);
    setStep("analyzing");

    const { category, ...restPrefs } = prefs;

    try {
      const response = await fetch("/api/analysis/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          category: category || "full",
          preferences: restPrefs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start analysis");
      }

      setAnalysisId(data.analysisId);
    } catch (err) {
      console.error("Failed to start analysis:", err);
      setError(err instanceof Error ? err.message : "Failed to start analysis. Please try again.");
      setStep("preferences");
    }
  };

  const handleAnalysisComplete = () => {
    setStep("results");
  };

  const handleBackToUpload = () => {
    setStep("upload");
    setImageUrl(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoUpload onUploadComplete={handleUploadComplete} />
          </motion.div>
        )}

        {step === "preferences" && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            <PreferencesForm
              onComplete={handlePreferencesComplete}
              onBack={handleBackToUpload}
            />
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AnalysisLoading
              analysisId={analysisId}
              onComplete={handleAnalysisComplete}
            />
          </motion.div>
        )}

        {step === "results" && analysisId && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-lg text-gray-300">
              Your analysis is ready!
            </p>
            <Link href={`/results/${analysisId}`}>
              <Button size="lg">View Results</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
