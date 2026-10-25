"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/i18n";

const BAR_HEIGHTS = [
  30, 55, 80, 45, 95, 60, 35, 85, 50, 70,
  40, 90, 55, 30, 75, 45, 65, 35, 80, 50,
];

type SpeechResult = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechResult) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type VoiceControlProps = {
  onTranscript: (text: string) => void;
};

const SPEECH_LOCALES: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
  ta: "ta-IN",
};

export default function VoiceControl({
  onTranscript,
}: VoiceControlProps) {
  const { t, language } = useLanguage();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function toggleVoice() {
    if (running) {
      recognitionRef.current?.stop();
      setRunning(false);
      setStatus("");
      return;
    }

    const browserWindow = window as Window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };

    const Recognition =
      browserWindow.SpeechRecognition ??
      browserWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setStatus(
        "Speech recognition isn't supported in this browser. Try Google Chrome."
      );
      return;
    }

    try {
      const recognition = new Recognition();
      recognition.lang = SPEECH_LOCALES[language];
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript?.trim();

        if (transcript) {
          setStatus(`Recognised: ${transcript}`);
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event) => {
        setRunning(false);

        if (event.error === "not-allowed") {
          setStatus("Microphone permission was denied. Allow microphone access in your browser.");
        } else if (event.error === "no-speech") {
          setStatus("No speech detected. Please try again.");
        } else {
          setStatus(`Voice recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setRunning(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      setStatus("Listening… Please speak now.");
      setRunning(true);
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setRunning(false);
      setStatus("Couldn't start the microphone. Please try again.");
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-navy-900/70 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-300">
          {t("voiceTitle")}
        </span>
        <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-300">
          {t("voiceBadge")}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        <button
          id="voice-demo-button"
          type="button"
          onClick={toggleVoice}
          aria-pressed={running}
          aria-label={running ? t("voiceStop") : t("voiceStart")}
          title={running ? t("voiceStop") : t("voiceStart")}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${
            running
              ? "border-teal-300/70 bg-teal-500/25 text-teal-100 shadow-[0_0_20px_-4px_rgba(45,212,191,0.8)]"
              : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          {running ? (
            <Square className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Mic className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        <div
          className="flex h-10 flex-1 items-center justify-between"
          aria-hidden="true"
        >
          {BAR_HEIGHTS.map((height, index) => (
            <span
              key={index}
              className={`w-[3px] rounded-full ${
                running ? "wave-active bg-teal-300/80" : "bg-slate-600/60"
              }`}
              style={{
                height: `${running ? height : 18}%`,
                animationDelay: `${index * 60}ms`,
              }}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-2 text-[11px] font-medium text-slate-300">
        {status || (running ? t("voiceRunning") : t("voiceIdle"))}
      </p>
      <p className="text-[11px] leading-snug text-slate-500">
        {t("voiceNote")}
      </p>
    </div>
  );
}