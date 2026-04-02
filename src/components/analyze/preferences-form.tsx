"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/components/analyze/category-selector";

const genderOptions = ["Male", "Female", "Non-Binary", "Prefer not to say"];
const budgetOptions = ["Budget Friendly", "Moderate", "Premium", "No Preference"];
const occasionOptions = [
  "Casual",
  "Wedding",
  "Interview",
  "Date Night",
  "Party",
  "No specific",
];
const styleOptions = ["Casual", "Formal", "Trendy", "Classic", "Edgy", "Minimal"];
const concernOptions = [
  "Acne/Breakouts",
  "Hair Loss/Thinning",
  "Dry Skin",
  "Oily Skin",
  "Dark Circles",
  "Dandruff",
  "Brittle Nails",
  "Wrinkles/Fine Lines",
  "Pigmentation",
  "Frizzy Hair",
];

interface PreferencesFormProps {
  onComplete: (prefs: Record<string, unknown>) => void;
  onBack: () => void;
}

function PillGroup({
  label,
  options,
  selected,
  onSelect,
  multi = false,
}: {
  label: string;
  options: string[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multi?: boolean;
}) {
  const isSelected = (opt: string) =>
    multi
      ? (selected as string[]).includes(opt)
      : selected === opt;

  const colorClass = multi ? "bg-purple-500" : "bg-indigo-500";

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-300">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              isSelected(opt)
                ? `${colorClass} text-white`
                : "border border-white/15 bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreferencesForm({ onComplete, onBack }: PreferencesFormProps) {
  const [category, setCategory] = useState("full");
  const [gender, setGender] = useState("");
  const [budget, setBudget] = useState("");
  const [occasion, setOccasion] = useState("");
  const [style, setStyle] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const isValid = gender && budget && occasion && style;

  const handleSubmit = () => {
    if (!isValid) return;
    onComplete({
      category,
      gender,
      budget,
      occasion,
      style,
      concerns,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg mx-auto space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">
          Tell us about yourself
        </h2>
        <p className="text-sm text-gray-400">
          Help the Genie personalize your analysis
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-300">
          Analysis Type
        </p>
        <CategorySelector selected={category} onSelect={setCategory} />
      </div>

      <PillGroup
        label="Gender"
        options={genderOptions}
        selected={gender}
        onSelect={setGender}
      />

      <PillGroup
        label="Budget"
        options={budgetOptions}
        selected={budget}
        onSelect={setBudget}
      />

      <PillGroup
        label="Occasion"
        options={occasionOptions}
        selected={occasion}
        onSelect={setOccasion}
      />

      <PillGroup
        label="Style"
        options={styleOptions}
        selected={style}
        onSelect={setStyle}
      />

      <PillGroup
        label="Concerns (select all that apply)"
        options={concernOptions}
        selected={concerns}
        onSelect={toggleConcern}
        multi
      />

      <div className="flex items-center gap-3 pt-2">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Start AI Analysis \u2728
        </Button>
      </div>
    </motion.div>
  );
}
