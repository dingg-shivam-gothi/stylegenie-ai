import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";
import StyleScoreRing from "@/components/results/style-score-ring";
import CategoryCard from "@/components/results/category-card";
import RecommendationCard from "@/components/results/recommendation-card";
import ShareButton from "./share-button";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: analysis } = await supabase
    .from("analyses")
    .select("style_score, category, created_at")
    .eq("id", id)
    .single();

  if (!analysis) {
    return { title: "Analysis Not Found | StyleGenie AI" };
  }

  const title = `Style Score: ${analysis.style_score ?? "N/A"} | StyleGenie AI`;
  const description = `${analysis.category} analysis completed on ${new Date(analysis.created_at).toLocaleDateString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

const categories = [
  { key: "hair_analysis" as const, title: "Hair", icon: "\uD83D\uDC87", color: "#6366f1" },
  { key: "skin_analysis" as const, title: "Skin", icon: "\u2728", color: "#f59e0b" },
  { key: "nail_analysis" as const, title: "Nails", icon: "\uD83D\uDC85", color: "#22c55e" },
  { key: "grooming_analysis" as const, title: "Grooming", icon: "\uD83E\uDDD4", color: "#ef4444" },
];

function jsonToRecord(value: Json): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (!analysis || analysis.status !== "completed") {
    notFound();
  }

  const { data: recommendations } = await supabase
    .from("recommendations")
    .select("*")
    .eq("analysis_id", id)
    .order("sort_order", { ascending: true });

  const score = analysis.style_score ?? 0;

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Style Analysis
          </h1>
          <p className="text-gray-400">
            Analyzed on{" "}
            {new Date(analysis.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Style Score Ring */}
        <div className="flex justify-center mb-12">
          <StyleScoreRing score={score} />
        </div>

        {/* Category Cards Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-5">
            Category Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.key}
                icon={cat.icon}
                title={cat.title}
                color={cat.color}
                data={jsonToRecord(analysis[cat.key])}
              />
            ))}
          </div>
        </section>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-5">
              Recommendations
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Share Button */}
        <div className="flex justify-center">
          <ShareButton
            title="My StyleGenie AI Analysis"
            text={`I scored ${score}/100 on my style analysis!`}
          />
        </div>
      </div>
    </main>
  );
}
