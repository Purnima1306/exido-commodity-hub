"use client";

import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import Hero from "./Hero";
import ProfessionFlow from "./ProfessionFlow";
import AssistantPanel from "@/components/assistant/AssistantPanel";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeShell() {
  const { t } = useLanguage();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [voiceFocusToken, setVoiceFocusToken] = useState(0);

  const closeAssistant = useCallback(() => setAssistantOpen(false), []);
  const openAssistant = useCallback(() => setAssistantOpen(true), []);
  const toggleAssistant = useCallback(() => setAssistantOpen((open) => !open), []);
  const openVoice = useCallback(() => {
    setAssistantOpen(true);
    setVoiceFocusToken((token) => token + 1);
  }, []);

  return (
    <>
      <Header
        assistantOpen={assistantOpen}
        onToggleAssistant={toggleAssistant}
        onOpenVoice={openVoice}
      />

      {/* On large screens the panel sits beside the content, so the flowchart stays visible.
          On phones and small tablets it slides over the page as an overlay. */}
      <div className="mx-auto flex w-full max-w-[1600px] items-start gap-6 px-4 sm:px-6 lg:px-8">
        <main className="min-w-0 flex-1">
          <Hero onOpenAssistant={openAssistant} />
          <ProfessionFlow />
        </main>

        {assistantOpen && (
          <>
            <button
              type="button"
              aria-label={t("close")}
              onClick={closeAssistant}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <AssistantPanel onClose={closeAssistant} voiceFocusToken={voiceFocusToken} />
          </>
        )}
      </div>
    </>
  );
}