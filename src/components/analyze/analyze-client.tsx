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

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    setStep("preferences");
  };

  const handlePreferencesComplete = async (prefs: Record<string, unknown>) => {
    setPreferences(prefs);
    setStep("analyzing");

    try {
      const response = await fetch("/api/analysis/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, preferences: prefs }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start analysis");
      }

      setAnalysisId(data.analysisId);
    } catch (error) {
      console.error("Failed to start analysis:", error);
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
            <PreferencesForm
              onComplete={handlePreferencesComplete}
              onBack={handleBackToUpload}
            />
          </motion.div>
        )}

        {step === "analyzing" && analysisId && (
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
