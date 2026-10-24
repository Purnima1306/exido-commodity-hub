"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/i18n";
import { useRouter } from "next/navigation";

const languages = ["English", "Hindi", "Gujarati", "Tamil"];
const translations: Record<string, Record<string, string>> = {
  English: {
    tagline: "YOUR AI-POWERED COMMODITY ANALYTICS PARTNER",
    heading: "What is your profession?",
    subtitle: "Ask. Analyze. Trade Smarter.",
    heroTitle: "Voice Assistant",
    heroSubtitle: "& AI Assistant",
    description:
      "Explore commodity derivatives, compare gold contracts and understand market movements through a simple conversational interface.",
    personalize: "PERSONALIZE YOUR EXPERIENCE",
    selectDescription:
      "Select a profile to explore a tailored dashboard experience.",
    trader: "Trader",
    retailer: "Retailer",
    wholesaler: "Wholesaler",
    traderDescription:
      "Track market trends, analyze price movements and explore trading opportunities.",
    retailerDescription:
      "Monitor prices, manage inventory and plan your procurement with confidence.",
    wholesalerDescription:
      "Track bulk orders, compare contracts and manage your supply chain.",
    selectProfile: "Select profile",
    selected: "Selected",
    voiceAssistant: "Voice Assistant",
    aiAssistant: "AI Assistant",
    voicePreview: "Voice interface preview",
    chatPreview: "Chat interface preview",
    companion: "Your commodity companion",
    suggested: "Suggested questions",
    placeholder: "Ask about commodities...",
    demo: "Demo only · No live AI",
    demoSelected: "Demo selected · No recording",
    disclaimer : "Interface preview · Live MCX data is not connected.",
    profileSelected: "profile selected.",
    personalized: "Role-specific dashboard features can be connected here.",
    openAssistant: "Open AI Assistant",
    question1: "Show me the latest gold futures prices",
    question2: "What is the trading volume for GOLDM?",
    question3: "Explain the price difference between GOLDM and GOLDTEN",
    question4: "What are the margin requirements?",
    question5: "Show me a summary of market trends",
    greeting: "Hello! Welcome to EXIDO. Ask me about commodity contracts, market analysis or how to use this platform.",
    autoAnswer: "This is the EXIDO interface demo. Live MCX market data and AI responses are not connected yet.",
  },
  Hindi: {
    tagline: "आपका AI कमोडिटी एनालिटिक्स पार्टनर",
    heading: "आपका व्यवसाय क्या है?",
    subtitle: "पूछें। विश्लेषण करें। बेहतर ट्रेड करें।",
    heroTitle: "वॉइस असिस्टेंट",
    heroSubtitle: "और AI असिस्टेंट",
    description:
      "कमोडिटी डेरिवेटिव्स को समझें, सोने के कॉन्ट्रैक्ट की तुलना करें और बाज़ार की गतिविधियों का विश्लेषण करें।",
    personalize: "अपने अनुभव को व्यक्तिगत बनाएं",
    selectDescription: "अपना डैशबोर्ड देखने के लिए प्रोफ़ाइल चुनें।",
    trader: "ट्रेडर",
    retailer: "रिटेलर",
    wholesaler: "थोक विक्रेता",
    traderDescription:
      "बाज़ार के रुझान और कीमतों में बदलाव देखें।",
    retailerDescription:
      "कीमतों और इन्वेंट्री पर नज़र रखें और खरीद की योजना बनाएं।",
    wholesalerDescription:
      "थोक ऑर्डर और कॉन्ट्रैक्ट की तुलना करें।",
    selectProfile: "प्रोफ़ाइल चुनें",
    selected: "चुना गया",
    voiceAssistant: "वॉइस असिस्टेंट",
    aiAssistant: "AI असिस्टेंट",
    voicePreview: "वॉइस इंटरफ़ेस का पूर्वावलोकन",
    chatPreview: "चैट इंटरफ़ेस का पूर्वावलोकन",
    companion: "आपका कमोडिटी सहायक",
    suggested: "सुझाए गए प्रश्न",
    placeholder: "कमोडिटी के बारे में पूछें...",
    demo: "डेमो · लाइव AI उपलब्ध नहीं",
    demoSelected: "डेमो चुना गया · रिकॉर्डिंग नहीं",
    disclaimer: "इंटरफ़ेस डेमो · MCX का लाइव डेटा जुड़ा नहीं है।",
    profileSelected: "प्रोफ़ाइल चुनी गई।",
    personalized: "यहाँ आपकी भूमिका के अनुसार सुविधाएँ जोड़ी जा सकती हैं।",
    openAssistant: "AI असिस्टेंट खोलें",
    question1: "सोने के फ्यूचर्स की नवीनतम कीमतें दिखाएँ",
question2: "GOLDM का ट्रेडिंग वॉल्यूम कितना है?",
question3: "GOLDM और GOLDTEN की कीमतों में अंतर समझाएँ",
question4: "मार्जिन की आवश्यकताएँ क्या हैं?",
question5: "बाज़ार के रुझानों का सारांश दिखाएँ",
greeting: "नमस्ते! EXIDO में आपका स्वागत है। कमोडिटी कॉन्ट्रैक्ट या बाज़ार विश्लेषण के बारे में पूछें।",
autoAnswer: "यह EXIDO का डेमो है। MCX का लाइव डेटा और AI जवाब अभी जुड़े नहीं हैं।",
  },
  Gujarati: {
    tagline: "તમારો AI કોમોડિટી એનાલિટિક્સ પાર્ટનર",
    heading: "તમારો વ્યવસાય શું છે?",
    subtitle: "પૂછો. વિશ્લેષણ કરો. વધુ સારી રીતે ટ્રેડ કરો.",
    heroTitle: "વૉઇસ આસિસ્ટન્ટ",
    heroSubtitle: "અને AI આસિસ્ટન્ટ",
    description:
      "કોમોડિટી ડેરિવેટિવ્સ સમજો, સોનાના કરારોની સરખામણી કરો અને બજારની ગતિવિધિઓનું વિશ્લેષણ કરો.",
    personalize: "તમારા અનુભવને વ્યક્તિગત બનાવો",
    selectDescription: "તમારું ડેશબોર્ડ જોવા માટે પ્રોફાઇલ પસંદ કરો.",
    trader: "ટ્રેડર",
    retailer: "રિટેલર",
    wholesaler: "જથ્થાબંધ વેપારી",
    traderDescription: "બજારના વલણો અને ભાવમાં થતા ફેરફારો જુઓ.",
    retailerDescription: "ભાવ અને ઇન્વેન્ટરી પર નજર રાખો અને ખરીદીનું આયોજન કરો.",
    wholesalerDescription: "જથ્થાબંધ ઓર્ડર અને કરારોની સરખામણી કરો.",
    selectProfile: "પ્રોફાઇલ પસંદ કરો",
    selected: "પસંદ કરેલ",
    voiceAssistant: "વૉઇસ આસિસ્ટન્ટ",
    aiAssistant: "AI આસિસ્ટન્ટ",
    voicePreview: "વૉઇસ ઇન્ટરફેસનું પૂર્વાવલોકન",
    chatPreview: "ચેટ ઇન્ટરફેસનું પૂર્વાવલોકન",
    companion: "તમારો કોમોડિટી સહાયક",
    suggested: "સૂચવેલા પ્રશ્નો",
    placeholder: "કોમોડિટી વિશે પૂછો...",
    demo: "ડેમો · લાઇવ AI જોડાયેલ નથી",
    demoSelected: "ડેમો પસંદ કરેલ · રેકોર્ડિંગ નથી",
    disclaimer: "ઇન્ટરફેસ ડેમો · MCX નો લાઇવ ડેટા જોડાયેલ નથી.",
    profileSelected: "પ્રોફાઇલ પસંદ કરી.",
    personalized: "અહીં તમારી ભૂમિકા અનુસાર સુવિધાઓ ઉમેરી શકાય છે.",
    openAssistant: "AI આસિસ્ટન્ટ ખોલો",
    question1: "સોનાના ફ્યુચર્સના નવીનતમ ભાવ બતાવો",
question2: "GOLDM નું ટ્રેડિંગ વોલ્યુમ કેટલું છે?",
question3: "GOLDM અને GOLDTEN ના ભાવનો તફાવત સમજાવો",
question4: "માર્જિનની જરૂરિયાતો શું છે?",
question5: "બજારના વલણોનો સારાંશ બતાવો",
greeting: "નમસ્તે! EXIDO માં આપનું સ્વાગત છે. કોમોડિટી કરારો અથવા બજાર વિશ્લેષણ વિશે પૂછો.",
autoAnswer: "આ EXIDO નો ડેમો છે. MCX નો લાઇવ ડેટા અને AI જવાબો હજી જોડાયેલા નથી.",
  },
  Tamil: {
    tagline: "உங்கள் AI பொருட்கள் பகுப்பாய்வு உதவியாளர்",
    heading: "உங்கள் தொழில் என்ன?",
    subtitle: "கேளுங்கள். பகுப்பாய்வு செய்யுங்கள். சிறப்பாக வர்த்தகம் செய்யுங்கள்.",
    heroTitle: "குரல் உதவியாளர்",
    heroSubtitle: "மற்றும் AI உதவியாளர்",
    description:
      "பொருள் வழித்தோன்றல்களைப் புரிந்து, தங்க ஒப்பந்தங்களை ஒப்பிட்டு, சந்தை மாற்றங்களை ஆராயுங்கள்.",
    personalize: "உங்கள் அனுபவத்தைத் தனிப்பயனாக்குங்கள்",
    selectDescription: "உங்கள் டாஷ்போர்டைப் பார்க்க ஒரு சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்.",
    trader: "வர்த்தகர்",
    retailer: "சில்லறை விற்பனையாளர்",
    wholesaler: "மொத்த விற்பனையாளர்",
    traderDescription: "சந்தைப் போக்குகளையும் விலை மாற்றங்களையும் கண்காணிக்கவும்.",
    retailerDescription: "விலைகள் மற்றும் இருப்பைக் கண்காணித்து கொள்முதலைத் திட்டமிடுங்கள்.",
    wholesalerDescription: "மொத்த ஆர்டர்களையும் ஒப்பந்தங்களையும் ஒப்பிடுங்கள்.",
    selectProfile: "சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்",
    selected: "தேர்ந்தெடுக்கப்பட்டது",
    voiceAssistant: "குரல் உதவியாளர்",
    aiAssistant: "AI உதவியாளர்",
    voicePreview: "குரல் இடைமுக முன்னோட்டம்",
    chatPreview: "அரட்டை இடைமுக முன்னோட்டம்",
    companion: "உங்கள் பொருள் உதவியாளர்",
    suggested: "பரிந்துரைக்கப்பட்ட கேள்விகள்",
    placeholder: "பொருட்களைப் பற்றி கேளுங்கள்...",
    demo: "முன்னோட்டம் · நேரடி AI இணைக்கப்படவில்லை",
    demoSelected: "முன்னோட்டம் தேர்ந்தெடுக்கப்பட்டது · பதிவு இல்லை",
    disclaimer: "இடைமுக முன்னோட்டம் · MCX நேரடி தரவு இணைக்கப்படவில்லை.",
    profileSelected: "சுயவிவரம் தேர்ந்தெடுக்கப்பட்டது.",
    personalized: "உங்கள் தொழிலுக்கேற்ற அம்சங்களை இங்கே இணைக்கலாம்.",
    openAssistant: "AI உதவியாளரைத் திறக்கவும்",
    question1: "சமீபத்திய தங்க ஃபியூச்சர்ஸ் விலைகளைக் காட்டுங்கள்",
question2: "GOLDM வர்த்தக அளவு என்ன?",
question3: "GOLDM மற்றும் GOLDTEN விலை வேறுபாட்டை விளக்குங்கள்",
question4: "மார்ஜின் தேவைகள் என்ன?",
question5: "சந்தைப் போக்குகளின் சுருக்கத்தைக் காட்டுங்கள்",
greeting: "வணக்கம்! EXIDO-க்கு வரவேற்கிறோம். பொருள் ஒப்பந்தங்கள் அல்லது சந்தைப் பகுப்பாய்வு பற்றி கேளுங்கள்.",
autoAnswer: "இது EXIDO டெமோ. MCX நேரடி தரவும் AI பதில்களும் இன்னும் இணைக்கப்படவில்லை.",
  },
};
  

const suggestions = [
  { key: "question1", text: translations.English.question1 },
  { key: "question2", text: translations.English.question2 },
  { key: "question3", text: translations.English.question3 },
  { key: "question4", text: translations.English.question4 },
  { key: "question5", text: translations.English.question5 },
];

const roles = [
  {
    name: "Trader",
    icon: "↗",
    color: "#f2c45f",
    description:
      "Track market trends, analyze price movements and explore trading opportunities.",
  },
  {
    name: "Retailer",
    icon: "▤",
    color: "#b779ff",
    description:
      "Monitor prices, manage inventory and plan your procurement with confidence.",
  },
  {
    name: "Wholesaler",
    icon: "⌂",
    color: "#16e2c2",
    description:
      "Track bulk orders, compare contracts and manage your supply chain.",
  },
];

export default function Home() {
  const router = useRouter();
  const { setLanguage: setAppLanguage } = useLanguage();
const [language, setLanguage] = useState("English");

const languageCodes: Record<string, Language> = {
  English: "en",
  Hindi: "hi",
  Gujarati: "gu",
  Tamil: "ta",
};

function changeLanguage(value: string) {
  setLanguage(value);
  setAppLanguage(languageCodes[value] ?? "en");
}
  const t = translations[language] || translations.English;
  const [selectedRole, setSelectedRole] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState<
    { role: string; text: string }[]
  >([
    {
      role: "assistant",
      text: translations.English.greeting,
    },
  ]);
  const localizedMessages = messages.map((message, index) => {
    if (message.role !== "assistant") return message;

    if (index === 0) {
      return { ...message, text: t.greeting };
    }

    return { ...message, text: t.autoAnswer };
  });

  function sendMessage(text = question) {
  const cleanText = text.trim();
  if (!cleanText) return;

  const query = cleanText.toLowerCase();

  let answer = "";

  if (
    query.includes("gold") ||
    query.includes("mcx") ||
    query.includes("price")
  ) {
    answer =
      "Gold and MCX contracts can be evaluated using contract specifications, liquidity, margin requirements, and price movements. EXIDO does not currently have live market prices connected, so please verify current prices on an official market platform.";
  } else if (
    query.includes("margin") ||
    query.includes("risk") ||
    query.includes("liquidity")
  ) {
    answer =
      "Before trading, review the required margin, market liquidity, contract size, and potential losses. These factors can change, so verify the latest details with your broker or official exchange information.";
  } else if (
    query.includes("retail") ||
    query.includes("inventory") ||
    query.includes("stock")
  ) {
    answer =
      "For retail inventory management, track available stock, purchase costs, sales, and reorder levels. EXIDO currently provides a frontend demonstration; live inventory records are not connected.";
  } else if (
    query.includes("wholesale") ||
    query.includes("supplier") ||
    query.includes("bulk") ||
    query.includes("order")
  ) {
    answer =
      "For wholesale operations, compare supplier prices, order quantities, delivery terms, and inventory requirements. Actual supplier and order records are not connected to this demo.";
  } else if (
    query.includes("hello") ||
    query.includes("hi") ||
    query.includes("help")
  ) {
    answer =
      "Hello! I'm the EXIDO demo assistant. Ask me about gold contracts, trading risks, retail inventory, or wholesale operations.";
  } else {
    answer =
      "I can help with general questions about gold contracts, MCX trading considerations, retail inventory, and wholesale operations. My answers are demonstration responses, not live AI analysis or financial advice.";
  }

  setMessages((previous) => [
    ...previous,
    { role: "user", text: cleanText },
    { role: "assistant", text: answer },
  ]);

  setQuestion("");
}
  
  

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030817] text-slate-100">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[500px] rounded-full bg-teal-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-blue-300/15 bg-[#061127]/90 px-5 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-300/10 text-3xl text-amber-300">
            ◈
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white sm:text-xl">
              Commodity Derivatives
            </h1>
            <p className="text-sm tracking-wide text-blue-200/70">
              Intelligence Hub
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Choose language"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="rounded-xl border border-blue-300/20 bg-[#0a1830] px-3 py-3 text-sm text-white"
          >
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="rounded-xl border border-blue-300/20 bg-[#0a1830] px-4 py-3 text-sm hover:border-blue-300/50"
          >
            🎙 {t.voiceAssistant}
          </button>

          <button
            onClick={() => setAssistantOpen(true)}
            className="rounded-xl border border-blue-300/20 bg-[#0a1830] px-4 py-3 text-sm hover:border-blue-300/50"
          >
            ✧ {t.aiAssistant}
          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-300/30 bg-blue-500/10 text-xl">
            ♙
          </div>
        </nav>
      </header>

      {/* Main layout */}
      <div
        className={`relative z-10 grid ${
          assistantOpen
            ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px]"
            : "grid-cols-1"
        }`}
      >
        <section className="px-4 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-7 flex items-center justify-center gap-3 text-xs tracking-[0.18em] text-blue-200 sm:text-sm">
              <span className="h-px w-8 bg-blue-400" />
              {t.tagline}
              <span className="h-px w-8 bg-blue-400" />
            </div>

            {/* Assistant icons */}
            <div className="mb-6 flex items-center justify-center gap-7">
              <span className="text-3xl text-blue-300">〰</span>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/40 bg-blue-500/10 text-3xl shadow-[0_0_35px_rgba(59,130,246,0.18)]">
                🎙
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/40 bg-violet-500/10 text-3xl">
                ✧
              </div>
              <span className="text-3xl text-blue-300">〰</span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
  {t.heroTitle}
  <span className="block mt-2 bg-gradient-to-r from-blue-300 via-violet-300 to-blue-400 bg-clip-text text-transparent">
    {t.heroSubtitle}
  </span>
</h2>

            <p className="mt-4 text-xl text-blue-100">
              {t.subtitle}
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-blue-100/65 sm:text-base">
              {t.description}
            </p>

            {/* Assistant shortcuts */}
            <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="flex items-center gap-4 rounded-2xl border border-blue-300/20 bg-[#09162b]/90 p-4 text-left transition hover:border-blue-300/50"
              >
                <span className="text-3xl text-blue-300">🎙</span>
                <span>
                  <span className="block font-semibold text-white">
                    {t.voiceAssistant}
                  </span>
                  <span className="mt-1 block text-xs text-blue-100/50">
                    {t.voicePreview}
                  </span>
                </span>
              </button>

              <button
                onClick={() => setAssistantOpen(true)}
                className="flex items-center gap-4 rounded-2xl border border-violet-300/20 bg-[#09162b]/90 p-4 text-left transition hover:border-violet-300/50"
              >
                <span className="text-3xl text-violet-300">✧</span>
                <span>
                  <span className="block font-semibold text-white">
                    {t.aiAssistant}
                  </span>
                  <span className="mt-1 block text-xs text-blue-100/50">
                    {t.chatPreview}
                  </span>
                </span>
              </button>
            </div>

            {/* Profession selector */}
            <div className="relative mx-auto mt-16 max-w-5xl">
              <div className="absolute left-1/2 -top-8 h-8 w-px bg-blue-400/70" />

              <div className="rounded-2xl border border-blue-300/25 bg-[#08162c]/90 px-5 py-6 shadow-[0_0_35px_rgba(59,130,246,0.08)] sm:px-8">
                <p className="text-xs font-medium tracking-[0.2em] text-blue-300">
                  {t.personalize}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {t.heading}
                </h3>
                <p className="mt-2 text-sm text-blue-100/55">
                  {t.selectDescription}
                </p>
              </div>

              <div className="mx-auto h-7 w-px bg-blue-400/70" />
              <div className="mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

              <div className="grid gap-5 pt-5 sm:grid-cols-3">
                {roles.map((role) => (
                  <button
                    key={t[role.name.toLowerCase() as keyof typeof t]}
                    onClick={() => {
  setSelectedRole(role.name);
  router.push(`/dashboard/${role.name.toLowerCase()}`);
}}
                    className="rounded-2xl border bg-[#071329]/95 p-5 text-left transition duration-200 hover:-translate-y-1"
                    style={{
                      borderColor:
                        selectedRole === role.name
                          ? role.color
                          : `${role.color}55`,
                      boxShadow:
                        selectedRole === role.name
                          ? `0 0 25px ${role.color}25`
                          : "none",
                    }}
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl border text-2xl"
                      style={{
                        color: role.color,
                        borderColor: `${role.color}66`,
                        backgroundColor: `${role.color}12`,
                      }}
                    >
                      {role.icon}
                    </span>

                    <span
                      className="mt-4 block text-xl font-semibold"
                      style={{ color: role.color }}
                    >
                      {t[role.name.toLowerCase() as keyof typeof t]}
                    </span>

                    <span className="mt-2 block text-sm leading-6 text-blue-100/65">
                      {t[`${role.name.toLowerCase()}Description` as keyof typeof t]}
                    </span>

                    <span
                      className="mt-5 block text-sm font-medium"
                      style={{ color: role.color }}
                    >
                      {selectedRole === role.name ? t.selected : t.selectProfile}
                    </span>
                  </button>
                ))}
              </div>

              {selectedRole && (
                <div className="mt-5 rounded-xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                  <strong>
  {t[selectedRole.toLowerCase() as keyof typeof t]} {t.profileSelected}
</strong>
                  <p className="mt-1 text-blue-100/60">
                    Role-specific dashboard features can be connected here.
                  </p>
                </div>
              )}

              <p className="mt-7 text-xs text-blue-100/40">
                {t.disclaimer}
              </p>
            </div>
          </div>
        </section>

        {/* AI Assistant sidebar */}
        {assistantOpen && (
          <aside className="relative z-10 flex min-h-[650px] flex-col border-t border-blue-300/15 bg-[#071226]/95 lg:min-h-[calc(100vh-82px)] lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between border-b border-blue-300/15 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/25 bg-blue-500/10 text-2xl text-blue-200">
                  ✧
                </div>
                <div>
                  <h3 className="font-semibold text-white">{t.aiAssistant}</h3>
                  <p className="mt-1 text-xs text-blue-100/50">
                    {t.companion}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAssistantOpen(false)}
                aria-label="Close assistant"
                className="rounded-lg border border-blue-300/20 px-3 py-2 text-blue-100 hover:bg-blue-500/10"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {localizedMessages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[95%] rounded-2xl p-4 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-blue-500/20 text-blue-50"
                      : "rounded-tl-sm border border-blue-300/15 bg-blue-500/[0.06] text-blue-50/90"
                  }`}
                >
                  {message.role === "assistant" && (
                    <p className="mb-2 text-xs font-semibold tracking-wider text-blue-300">
                      EXIDO
                    </p>
                  )}
                  {message.text}
                </div>
              ))}

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-100/45">
                  {t.suggested}
                </p>
                <div className="space-y-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => sendMessage(t[item.key as keyof typeof t])}
                      className="w-full rounded-xl border border-blue-300/15 bg-[#0a1930] p-3 text-left text-sm leading-5 text-blue-100/80 transition hover:border-blue-400/50 hover:bg-blue-500/10"
                    >
                      <span className="mr-2 text-blue-300">✦</span>
                      {t[item.key as keyof typeof t]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-blue-300/15 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2 rounded-2xl border border-blue-300/20 bg-[#030817] p-2"
              >
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t.placeholder}
                  aria-label="Ask EXIDO a question"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-blue-100/35"
                />

                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  aria-label="Toggle voice demo"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    voiceEnabled
                      ? "border-amber-300/60 bg-amber-300/10 text-amber-200"
                      : "border-blue-300/20 text-blue-200"
                  }`}
                >
                  🎙
                </button>

                <button
                  type="submit"
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-400"
                >
                  ➤
                </button>
              </form>

              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-blue-100/45">
                <span>
                  {voiceEnabled ? t.demoSelected : t.demo}
                </span>

                <select
                  aria-label="Assistant language"
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="max-w-28 rounded-lg border border-blue-300/15 bg-[#081832] px-2 py-2 text-blue-100"
                >
                  {languages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
        )}

        {!assistantOpen && (
          <button
            onClick={() => setAssistantOpen(true)}
            className="fixed bottom-5 right-5 z-20 rounded-full border border-blue-300/30 bg-[#0b1c38] px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-blue-500/20"
          >
            ✧ {t.openAssistant}
          </button>
        )}
      </div>
    </main>
  );
}