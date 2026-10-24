import type { Language } from "@/lib/i18n";
import type { ProfessionId } from "@/lib/professions";

export type AssistantRequest = {
  question: string;
  language: Language;
  profession?: ProfessionId;
};

export type AssistantResponse =
  | { status: "placeholder" } // No backend connected yet
  | { status: "ok"; answer: string }; // Real answer from a future backend

/**
 * PLACEHOLDER. No AI service is connected.
 *
 * Later, replace the body with something like:
 *
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/assistant/ask`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(request),
 *   });
 *   if (!res.ok) throw new Error("Assistant request failed");
 *   const data = await res.json();
 *   return { status: "ok", answer: data.answer };
 */
export async function askAssistant(request: AssistantRequest): Promise<AssistantResponse> {
  void request; // not used until a backend exists
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { status: "placeholder" };
}