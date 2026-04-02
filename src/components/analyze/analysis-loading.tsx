"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const stages = [
  { label: "Detecting features...", icon: "\uD83D\uDD0D", duration: 2000 },
  { label: "Analyzing hair...", icon: "\uD83D\uDC87", duration: 3000 },
  { label: "Analyzing skin...", icon: "\u2728", duration: 3000 },
  { label: "Analyzing grooming...", icon: "\uD83E\uDDD4", duration: 2000 },
  { label: "Generating recommendations...", icon: "\uD83E\uDE84", duration: 3000 },
];

const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);

interface AnalysisLoadingProps {
  analysisId: string;
  onComplete: () => void;
}

export function AnalysisLoading({ analysisId, onComplete }: AnalysisLoadingProps) {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Advance stages based on durations
  useEffect(() => {
    let stageIndex = 0;

    const advanceStage = () => {
      if (stageIndex < stages.length - 1) {
        stageIndex += 1;
        setCurrentStage(stageIndex);
        stageTimerRef.current = setTimeout(advanceStage, stages[stageIndex].duration);
      }
    };

    stageTimerRef.current = setTimeout(advanceStage, stages[0].duration);

    return () => {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    };
  }, []);

  // Poll for completion
  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/analysis/${analysisId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "completed") {
        if (pollRef.current) clearInterval(pollRef.current);
        router.push(`/results/${analysisId}`);
        onComplete();
      }
    } catch {
      // silently retry on next interval
    }
  }, [analysisId, onComplete, router]);

  useEffect(() => {
    pollRef.current = setInterval(poll, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [poll]);

  // Progress calculation
  const elapsed = stages
    .slice(0, currentStage)
    .reduce((sum, s) => sum + s.duration, 0);
  const progress = Math.min(
    ((elapsed + stages[currentStage].duration * 0.5) / totalDuration) * 100,
    95
  );

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 py-8">
      {/* Animated wand */}
      <motion.div
        animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl"
      >
        {"\uD83E\uDE84"}
      </motion.div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-1">
          Genie is analyzing...
        </h2>
        <p className="text-sm text-gray-400">
          This usually takes a minute or two
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full bg-white/10 h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Stage list */}
      <div className="w-full space-y-3">
        {stages.map((stage, i) => {
          const isCompleted = i < currentStage;
          const isCurrent = i === currentStage;

          return (
            <div
              key={stage.label}
              className={`flex items-center gap-3 text-sm transition-opacity ${
                !isCompleted && !isCurrent ? "opacity-40" : "opacity-100"
              }`}
            >
              {/* Status indicator */}
              <span className="w-5 flex-shrink-0 text-center">
                {isCompleted ? (
                  <span className="text-green-400">{"\u2713"}</span>
                ) : isCurrent ? (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="inline-block h-2 w-2 rounded-full bg-indigo-400"
                  />
                ) : (
                  <span className="inline-block h-2 w-2 rounded-full bg-white/20" />
                )}
              </span>

              <span className="mr-1">{stage.icon}</span>
              <span className={isCurrent ? "text-white" : "text-gray-400"}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
