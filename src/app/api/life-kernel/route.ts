import { NextResponse } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Missing 'query' in request body" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Life Kernel is not configured. Missing GEMINI_API_KEY." },
        { status: 500 },
      );
    }

    const systemInstruction =
      "You are the Life Kernel for a personal operating system. " +
      "Given a user's query about their life, schedule, energy, or goals, " +
      "respond with a short summary plus 2-4 concrete recommendations. " +
      "Return ONLY valid JSON of the shape: {" +
      "  \"summary\": string, " +
      "  \"recommendations\": [{ \"title\": string, \"detail\": string }]" +
      "}. Do not include any markdown or explanation outside of JSON.";

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generationConfig: {
          responseMimeType: "application/json",
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nUser query: ${query}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("Gemini API error", response.status, text);
      return NextResponse.json(
        { error: "Life Kernel request to Gemini failed" },
        { status: 502 },
      );
    }

    const geminiPayload = await response.json();
    let text: string =
      geminiPayload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Life Kernel model" },
        { status: 502 },
      );
    }

    // Make parsing more robust in case the model wraps JSON in fences or extra text
    // Strip markdown code fences if present
    text = text.trim();
    if (text.startsWith("```")) {
      const firstNewline = text.indexOf("\n");
      const lastFence = text.lastIndexOf("```");
      if (firstNewline !== -1 && lastFence !== -1 && lastFence > firstNewline) {
        text = text.slice(firstNewline + 1, lastFence).trim();
      }
    }
    // Try to isolate the JSON object between the first '{' and last '}'
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1);
    }

    let parsed: {
      summary?: string;
      recommendations?: { title: string; detail: string }[];
    };
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON", parseErr, text);
      return NextResponse.json(
        { error: "Life Kernel model returned invalid JSON" },
        { status: 502 },
      );
    }

    const summary =
      typeof parsed.summary === "string"
        ? parsed.summary
        : "Life Kernel could not generate a summary.";

    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations
      : [];

    return NextResponse.json({ summary, recommendations });
  } catch (err) {
    console.error("Life Kernel API error", err);
    return NextResponse.json(
      { error: "Internal error in Life Kernel API" },
      { status: 500 },
    );
  }
}
