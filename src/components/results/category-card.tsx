"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryCardProps {
  icon: string;
  title: string;
  color: string;
  data: Record<string, unknown> | null;
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(renderValue).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoryCard({ icon, title, color, data }: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  const entries = Object.entries(data).filter(([key]) => key !== "recommendations");
  const recommendations = data.recommendations;
  const quickEntries = entries.slice(0, 3);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/5 p-5 cursor-pointer transition-colors hover:bg-white/[0.07]"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span
          className="ml-auto rounded-full px-3 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {entries.length} items
        </span>
      </div>

      {/* Quick summary */}
      {!expanded && (
        <div className="space-y-1">
          {quickEntries.map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-400">{formatKey(key)}</span>
              <span className="text-gray-200 text-right max-w-[60%] truncate">
                {renderValue(value)}
              </span>
            </div>
          ))}
          {entries.length > 3 && (
            <p className="text-xs text-gray-500 mt-2">
              Click to see {entries.length - 3} more...
            </p>
          )}
        </div>
      )}

      {/* Expanded view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {entries.map(([key, value]) => (
                <div key={key} className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-gray-400 mb-1">{formatKey(key)}</p>
                  <p className="text-sm text-gray-200">{renderValue(value)}</p>
                </div>
              ))}
            </div>

            {/* Recommendations within category data */}
            {Array.isArray(recommendations) && recommendations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-gray-500 mt-0.5">-</span>
                      <span>{renderValue(rec)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">Click to collapse</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
