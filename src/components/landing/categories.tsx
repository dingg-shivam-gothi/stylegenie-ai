"use client";

import { motion } from "framer-motion";

const categories = [
  {
    icon: "\ud83d\udc87",
    title: "Hair",
    color: "bg-indigo-500/10 text-indigo-400",
    description:
      "Texture, density, health, style recommendations based on your face shape",
  },
  {
    icon: "\u2728",
    title: "Skin",
    color: "bg-amber-500/10 text-amber-400",
    description:
      "Type, tone, conditions, hydration level, and treatment recommendations",
  },
  {
    icon: "\ud83d\udc85",
    title: "Nails",
    color: "bg-green-500/10 text-green-400",
    description:
      "Shape, health, art suggestions, and colors that complement your skin",
  },
  {
    icon: "\ud83e\uddd4",
    title: "Grooming",
    color: "bg-red-500/10 text-red-400",
    description:
      "Facial structure, beard/eyebrow shaping, overall style coherence",
  },
  {
    icon: "\ud83e\uddd6",
    title: "Spa",
    color: "bg-pink-500/10 text-pink-400",
    description:
      "Body treatments, relaxation recommendations, and wellness services",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Categories() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            What We Analyze
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Our AI covers every aspect of your beauty and grooming routine.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={item}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center hover:bg-white/[0.04] transition-colors"
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${cat.color}`}
              >
                {cat.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {cat.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{cat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
