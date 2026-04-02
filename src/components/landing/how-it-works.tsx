"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "\ud83d\udcf8",
    title: "Upload Your Photo",
    description:
      "Take a selfie or upload a photo. Our AI validates image quality instantly.",
  },
  {
    number: "02",
    icon: "\ud83e\ude84",
    title: "AI Analyzes",
    description:
      "Our genie analyzes your hair, skin, nails, and grooming in seconds.",
  },
  {
    number: "03",
    icon: "\ud83c\udfaf",
    title: "Get Recommendations",
    description:
      "Receive personalized suggestions based on your unique features and preferences.",
  },
  {
    number: "04",
    icon: "\ud83d\udcc5",
    title: "Book Services",
    description:
      "Find matching salons and spas near you. Book instantly through Zodule.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Get your personalized beauty and grooming analysis in four simple
            steps.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={item}
              className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <span className="text-xs font-mono text-indigo-400">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
