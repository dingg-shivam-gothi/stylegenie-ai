import OpenAI from "openai";
import type { AnalysisResult } from "./types";

let _openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return _openai;
}

export async function analyzeWithOpenAI(
  imageUrl: string,
  prompt: string
): Promise<AnalysisResult> {
  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "high" },
          },
        ],
      },
    ],
    max_tokens: 2000,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("No response content from OpenAI");
  }

  return JSON.parse(text) as AnalysisResult;
}
