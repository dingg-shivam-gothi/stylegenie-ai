"use client";

import { motion } from "framer-motion";
import type { Recommendation } from "@/lib/supabase/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const priorityConfig: Record<
  Recommendation["priority"],
  { label: string; color: string; bg: string }
> = {
  quick_win: { label: "Quick Win", color: "text-green-400", bg: "bg-green-500/20" },
  major_impact: { label: "Major Impact", color: "text-indigo-400", bg: "bg-indigo-500/20" },
  maintenance: { label: "Maintenance", color: "text-amber-400", bg: "bg-amber-500/20" },
};

const categoryIcons: Record<Recommendation["category"], string> = {
  hair: "\uD83D\uDC87",
  skin: "\u2728",
  nails: "\uD83D\uDC85",
  grooming: "\uD83E\uDDD4",
  spa: "\uD83E\uDDD6",
};

export default function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  const priority = priorityConfig[recommendation.priority];
  const icon = categoryIcons[recommendation.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-semibold text-white">
              {recommendation.title}
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.color} ${priority.bg}`}
            >
              {priority.label}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            {recommendation.description}
          </p>
          {recommendation.expected_outcome && (
            <div className="rounded-lg bg-white/5 px-3 py-2">
              <p className="text-xs text-gray-500 mb-0.5">Expected Outcome</p>
              <p className="text-sm text-gray-300">
                {recommendation.expected_outcome}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
