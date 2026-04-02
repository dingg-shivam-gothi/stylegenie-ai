import { createServerSupabaseClient } from "@/lib/supabase/server";
import { inngest } from "@/inngest/client";

export async function POST(request: Request) {
  try {
    const { imageUrl, category, preferences } = await request.json();

    if (!imageUrl || !category) {
      return Response.json(
        { error: "imageUrl and category are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get current user (optional — guests allowed)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Insert analysis record with status "processing"
    const { data: analysis, error } = await supabase
      .from("analyses")
      .insert({
        user_id: user?.id ?? null,
        image_url: imageUrl,
        category,
        preferences: preferences ?? {},
        status: "processing",
      })
      .select("id")
      .single();

    if (error || !analysis) {
      console.error("Failed to create analysis record:", error);
      return Response.json(
        { error: "Failed to start analysis" },
        { status: 500 }
      );
    }

    // Send Inngest event to trigger background analysis
    await inngest.send({
      name: "analysis/start",
      data: {
        analysisId: analysis.id,
        imageUrl,
        category,
        preferences: preferences ?? {},
      },
    });

    return Response.json({ analysisId: analysis.id });
  } catch (error) {
    console.error("Analysis start error:", error);
    return Response.json(
      { error: "Failed to start analysis" },
      { status: 500 }
    );
  }
}
