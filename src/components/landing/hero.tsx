"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-gray-950" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[128px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm">
            AI-Powered Beauty &amp; Grooming Analysis
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Scan. Wish. Transform.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto sm:text-xl"
        >
          Upload a photo and let AI analyze your hair, skin, nails, and
          grooming. Get personalized recommendations tailored to your unique
          features and style preferences.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/analyze">
            <Button size="lg" variant="primary">
              Analyze My Look Free
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="secondary">
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          variants={item}
          className="mt-12 text-sm text-gray-500"
        >
          For all genders &bull; Hair &bull; Skin &bull; Nails &bull; Grooming
          &bull; Free to try
        </motion.p>
      </motion.div>
    </section>
  );
}
