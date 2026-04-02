import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Fetch analysis by ID
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return Response.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    const analysis = data;

    // If completed, also fetch recommendations
    let recommendations = null;
    if (analysis.status === "completed") {
      const { data: recs } = await supabase
        .from("recommendations")
        .select("*")
        .eq("analysis_id", id)
        .order("sort_order", { ascending: true });

      recommendations = recs;
    }

    return Response.json({
      analysis,
      recommendations,
    });
  } catch (error) {
    console.error("Analysis fetch error:", error);
    return Response.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
