"use client";

import { motion } from "framer-motion";

const categories = [
  {
    id: "full",
    label: "Full Analysis",
    icon: "\u2728",
    description: "Hair, Skin, Nails & Grooming",
  },
  {
    id: "hair",
    label: "Hair Only",
    icon: "\uD83D\uDC87",
    description: "Style, texture & health",
  },
  {
    id: "skin",
    label: "Skin Only",
    icon: "\uD83E\uDDF4",
    description: "Type, tone & treatments",
  },
  {
    id: "nails",
    label: "Nails Only",
    icon: "\uD83D\uDC85",
    description: "Shape, health & art",
  },
];

interface CategorySelectorProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <motion.button
            key={cat.id}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition-colors cursor-pointer ${
              isSelected
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-sm font-medium text-white">{cat.label}</span>
            <span className="text-xs text-gray-400">{cat.description}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
