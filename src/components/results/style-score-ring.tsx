"use client";

import { motion } from "framer-motion";

interface StyleScoreRingProps {
  score: number;
}

function getScoreConfig(score: number) {
  if (score >= 80) return { color: "#22c55e", label: "Excellent" };
  if (score >= 60) return { color: "#6366f1", label: "Good" };
  if (score >= 40) return { color: "#f59e0b", label: "Average" };
  return { color: "#ef4444", label: "Needs Work" };
}

export default function StyleScoreRing({ score }: StyleScoreRingProps) {
  const { color, label } = getScoreConfig(score);
  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Animated score circle */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 100 100)"
        />
        {/* Score number */}
        <text
          x="100"
          y="92"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white text-5xl font-bold"
          style={{ fontSize: "48px", fontWeight: 700 }}
        >
          {score}
        </text>
        {/* Subtitle */}
        <text
          x="100"
          y="120"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-400 text-sm"
          style={{ fontSize: "12px" }}
        >
          out of 100
        </text>
      </svg>
      <span
        className="text-lg font-semibold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
