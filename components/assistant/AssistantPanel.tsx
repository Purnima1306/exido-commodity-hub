"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send, Sparkles, User, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { askAssistant } from "@/lib/assistant";
import type { TranslationKey } from "@/lib/i18n";
import VoiceControl from "@/components/VoiceControl";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text?: string; // user text, or a real answer from a future backend
  isPlaceholder?: boolean; // true = show the translated placeholder reply
};

const SUGGESTED_QUESTIONS: TranslationKey[] = ["q1", "q2", "q3", "q4"];

type AssistantPanelProps = {
  onClose: () => void;
  voiceFocusToken: number;
};

export default function AssistantPanel({ onClose, voiceFocusToken }: AssistantPanelProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close with the Escape key
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Keep the newest message in view
  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isReplying]);

  // When the header "Voice Assistant" button is pressed, focus the voice demo button
  useEffect(() => {
    if (voiceFocusToken > 0) {
      document.getElementById("voice-demo-button")?.focus();
    }
  }, [voiceFocusToken]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isReplying) return;

    const userMessage: ChatMessage = { id: nextId.current++, role: "user", text: trimmed };
    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsReplying(true);

    try {
      const response = await askAssistant({ question: trimmed, language });
      const reply: ChatMessage =
        response.status === "ok"
          ? { id: nextId.current++, role: "assistant", text: response.answer }
          : { id: nextId.current++, role: "assistant", isPlaceholder: true };
      setMessages((previous) => [...previous, reply]);
    } catch {
      // The placeholder service never fails. A real backend call will need an error message here.
    } finally {
      setIsReplying(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  return (
    <aside
      aria-label={t("assistantTitle")}
      className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-white/10 bg-navy-900/95 shadow-2xl backdrop-blur-xl lg:sticky lg:bottom-auto lg:right-auto lg:top-24 lg:z-auto lg:h-[calc(100dvh-7rem)] lg:w-[26rem] lg:max-w-none lg:shrink-0 lg:rounded-2xl lg:border lg:bg-navy-800/60 lg:shadow-[0_0_60px_-24px_rgba(59,130,246,0.6)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3.5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-white">{t("assistantTitle")}</h2>
            <p className="text-[11px] leading-snug text-gold-300">{t("assistantSubtitle")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          title={t("close")}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Scrollable conversation area */}
      <div
        ref={scrollRef}
        aria-live="polite"
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
      >
        {/* Welcome message (re-translates when the language changes) */}
        <div className="flex gap-2.5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-300">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm leading-relaxed text-slate-200">
            {t("assistantWelcome")}
          </div>
        </div>

        {/* Suggested questions */}
        <div>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t("suggestedTitle")}
          </h3>
          <div className="flex flex-col gap-2">
            {SUGGESTED_QUESTIONS.map((key) => (
              <button
                key={key}
                type="button"
                disabled={isReplying}
                onClick={() => void submitQuestion(t(key))}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-[13px] leading-snug text-slate-200 transition hover:border-blue-400/50 hover:bg-blue-500/10 disabled:opacity-50"
              >
                {t(key)}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <User className="h-3 w-3" aria-hidden="true" />
                {t("you")}
              </span>
              <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-blue-600/80 px-3.5 py-2.5 text-sm leading-relaxed text-white">
                {message.text}
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-300">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-500">{t("assistantName")}</span>
                <div
                  className={`mt-1 rounded-2xl rounded-tl-sm border px-3.5 py-2.5 text-sm leading-relaxed text-slate-200 ${
                    message.isPlaceholder
                      ? "border-gold-400/30 bg-gold-400/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {message.isPlaceholder ? t("assistantPlaceholderReply") : message.text}
                </div>
              </div>
            </div>
          ),
        )}

        {isReplying && (
          <div className="flex gap-2.5">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-300">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-400">
              …
            </div>
          </div>
        )}
      </div>

      {/* Voice control + input (pinned to the bottom) */}
      <div className="space-y-3 border-t border-white/10 p-3">
        <VoiceControl />

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("chatPlaceholder")}
            aria-label={t("chatPlaceholder")}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-navy-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-400/60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isReplying}
            aria-label={t("send")}
            title={t("send")}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  );
}