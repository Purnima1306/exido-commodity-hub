import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = body.message;
    const language = body.language || "English";

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: message,
      config: {
        systemInstruction:
          `You are EXIDO, a helpful commodity analytics assistant. ` +
          `Reply in ${language}. Explain gold and commodity derivatives clearly. ` +
          `Do not invent live market prices or financial data. ` +
          `Provide general information, not guaranteed investment advice.`,
      },
    });

    return NextResponse.json({
      reply: response.text || "Sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}