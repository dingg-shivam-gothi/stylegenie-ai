import { createClient } from "@supabase/supabase-js";
import { inngest } from "../client";
import { buildAnalysisPrompt } from "@/lib/ai/prompt";
import { analyzeWithGemini } from "@/lib/ai/gemini";
import { analyzeWithOpenAI } from "@/lib/ai/openai";
import { getRedis } from "@/lib/redis";
import type { AnalysisResult } from "@/lib/ai/types";
import type { Database } from "@/lib/supabase/types";

function getSupabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const analyzeImage = inngest.createFunction(
  {
    id: "analyze-image",
    name: "Analyze Image",
    retries: 2,
    triggers: [{ event: "analysis/start" }],
  },
  async ({ event, step }) => {
    const { analysisId, imageUrl, category, preferences } = event.data as {
      analysisId: string;
      imageUrl: string;
      category: "full" | "hair" | "skin" | "nails";
      preferences: Record<string, unknown>;
    };

    const startTime = Date.now();

    // Step 1: Check Redis cache
    const cacheKey = `analysis:${imageUrl}:${category}`;
    const cached = await step.run("check-cache", async () => {
      const cachedResult = await getRedis().get<AnalysisResult>(cacheKey);
      return cachedResult;
    });

    let result: AnalysisResult;
    let aiProvider: "gemini" | "openai";

    if (cached) {
      result = cached;
      aiProvider = "gemini"; // cached, provider unknown — default to gemini
    } else {
      // Step 2: Run AI analysis with fallback
      const aiResult = await step.run("ai-analysis", async () => {
        const prompt = buildAnalysisPrompt(category, preferences);

        try {
          const geminiResult = await analyzeWithGemini(imageUrl, prompt);
          return { result: geminiResult, provider: "gemini" as const };
        } catch (geminiError) {
          console.error("Gemini analysis failed, falling back to OpenAI:", geminiError);
          const openaiResult = await analyzeWithOpenAI(imageUrl, prompt);
          return { result: openaiResult, provider: "openai" as const };
        }
      });

      result = aiResult.result;
      aiProvider = aiResult.provider;

      // Step 3: Cache result in Redis for 24 hours
      await step.run("cache-result", async () => {
        await getRedis().set(cacheKey, result, { ex: 86400 });
      });
    }

    const processingMs = Date.now() - startTime;

    // Step 4: Update Supabase analysis record
    await step.run("update-analysis", async () => {
      const { error } = await getSupabaseAdmin()
        .from("analyses")
        .update({
          status: "completed",
          ai_provider: aiProvider,
          raw_result: result as unknown as Database["public"]["Tables"]["analyses"]["Update"]["raw_result"],
          style_score: result.styleScore,
          hair_analysis: result.hair as unknown as Database["public"]["Tables"]["analyses"]["Update"]["hair_analysis"],
          skin_analysis: result.skin as unknown as Database["public"]["Tables"]["analyses"]["Update"]["skin_analysis"],
          nail_analysis: result.nails as unknown as Database["public"]["Tables"]["analyses"]["Update"]["nail_analysis"],
          grooming_analysis: result.grooming as unknown as Database["public"]["Tables"]["analyses"]["Update"]["grooming_analysis"],
          processing_ms: processingMs,
        })
        .eq("id", analysisId);

      if (error) {
        throw new Error(`Failed to update analysis: ${error.message}`);
      }
    });

    // Step 5: Insert recommendations
    await step.run("insert-recommendations", async () => {
      if (!result.recommendations || result.recommendations.length === 0) {
        return;
      }

      const recommendations = result.recommendations.map((rec, index) => ({
        analysis_id: analysisId,
        category: rec.category,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        expected_outcome: rec.expectedOutcome,
        sort_order: index,
      }));

      const { error } = await getSupabaseAdmin()
        .from("recommendations")
        .insert(recommendations);

      if (error) {
        throw new Error(`Failed to insert recommendations: ${error.message}`);
      }
    });

    return { success: true, analysisId, provider: aiProvider };
  }
);
