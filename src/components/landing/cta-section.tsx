"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 p-12 text-center"
      >
        <div className="text-4xl mb-4">{"\ud83e\ude84"}</div>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to discover your best look?
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Join thousands of people who have transformed their beauty and
          grooming routine with AI-powered personalized recommendations.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/analyze">
            <Button size="lg" variant="primary">
              Start Free Analysis
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-sm text-gray-500">
            Own a salon, spa, or beauty business?{" "}
            <Link
              href="/business"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              Learn about our business tools
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
