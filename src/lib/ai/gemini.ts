import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "./types";

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  }
  return _genAI;
}

export async function analyzeWithGemini(
  imageUrl: string,
  prompt: string
): Promise<AnalysisResult> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

  // Fetch image and convert to base64
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");
  const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    },
  ]);

  const response = result.response;
  const text = response.text();

  // Handle potential markdown code block wrapping
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();

  return JSON.parse(jsonString) as AnalysisResult;
}
