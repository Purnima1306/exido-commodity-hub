import type { Language } from "@/lib/i18n";
import type { ProfessionId } from "@/lib/professions";

export type AssistantRequest = {
  question: string;
  language: Language;
  profession?: ProfessionId;
};

export type AssistantResponse = {
  status: "ok";
  answer: string;
};

const REPLIES: Record<Language, Record<string, string>> = {
  en: {
    liquidity:
      "Liquidity indicates how easily a commodity contract can be bought or sold without significantly affecting its price. Check the dashboard's liquidity analysis to compare contracts.",
    risk:
      "Commodity futures involve price and margin risk. Review the risk analysis, contract exposure, and available margin information before making a trading decision.",
    gold:
      "You can compare GOLDM, GOLDTEN, GOLDGUINEA, and GOLDPETAL using the dashboard's contract and relative-value analysis. These comparisons are historical analysis, not guaranteed trading signals.",
    backtest:
      "Backtesting evaluates a strategy against historical data. Remember that past performance does not guarantee future results, and transaction costs can turn a gross return into a net loss.",
    help:
      "I can explain liquidity, gold contracts, risk analysis, and historical backtesting. Ask about one of these topics. This is a local demo assistant, not a live AI service.",
    unknown:
      "I'm the local demo assistant. Try asking about liquidity, gold contracts, risk analysis, or backtesting. I don't currently have live market prices or a connected AI API.",
  },
  hi: {
    liquidity:
      "लिक्विडिटी बताती है कि किसी कमोडिटी कॉन्ट्रैक्ट को कीमत पर ज्यादा असर डाले बिना कितनी आसानी से खरीदा या बेचा जा सकता है। कॉन्ट्रैक्ट की तुलना के लिए डैशबोर्ड का लिक्विडिटी विश्लेषण देखें।",
    risk:
      "कमोडिटी फ्यूचर्स में कीमत और मार्जिन का जोखिम होता है। ट्रेडिंग का निर्णय लेने से पहले रिस्क एनालिसिस और उपलब्ध मार्जिन की जानकारी देखें।",
    gold:
      "आप डैशबोर्ड में GOLDM, GOLDTEN, GOLDGUINEA और GOLDPETAL कॉन्ट्रैक्ट की तुलना कर सकते हैं। यह ऐतिहासिक विश्लेषण है, पक्के ट्रेडिंग संकेत नहीं।",
    backtest:
      "बैकटेस्टिंग में किसी रणनीति को पुराने डेटा पर परखा जाता है। पुराने नतीजे भविष्य के मुनाफे की गारंटी नहीं देते। ट्रांजैक्शन कॉस्ट भी रिटर्न को प्रभावित करती है।",
    help:
      "मैं लिक्विडिटी, गोल्ड कॉन्ट्रैक्ट, रिस्क एनालिसिस और बैकटेस्टिंग समझा सकता हूँ। यह एक लोकल डेमो असिस्टेंट है, लाइव AI सेवा नहीं।",
    unknown:
      "मैं लोकल डेमो असिस्टेंट हूँ। लिक्विडिटी, गोल्ड कॉन्ट्रैक्ट, रिस्क एनालिसिस या बैकटेस्टिंग के बारे में पूछें। अभी मेरे पास लाइव मार्केट प्राइस या AI API कनेक्शन नहीं है।",
  },
  gu: {
    liquidity:
      "લિક્વિડિટી દર્શાવે છે કે કોમોડિટી કોન્ટ્રાક્ટને તેની કિંમત પર વધુ અસર કર્યા વગર કેટલી સરળતાથી ખરીદી કે વેચી શકાય છે. સરખામણી માટે ડેશબોર્ડનું લિક્વિડિટી વિશ્લેષણ જુઓ.",
    risk:
      "કોમોડિટી ફ્યુચર્સમાં કિંમત અને માર્જિનનું જોખમ હોય છે. ટ્રેડિંગનો નિર્ણય લેતા પહેલાં રિસ્ક એનાલિસિસ અને માર્જિનની માહિતી તપાસો.",
    gold:
      "તમે ડેશબોર્ડમાં GOLDM, GOLDTEN, GOLDGUINEA અને GOLDPETAL કોન્ટ્રાક્ટની સરખામણી કરી શકો છો. આ ઐતિહાસિક વિશ્લેષણ છે, ખાતરીપૂર્વકના ટ્રેડિંગ સંકેતો નથી.",
    backtest:
      "બેકટેસ્ટિંગમાં ઐતિહાસિક ડેટા પર ટ્રેડિંગ વ્યૂહરચનાની તપાસ થાય છે. ભૂતકાળનાં પરિણામો ભવિષ્યના નફાની ખાતરી આપતાં નથી. ટ્રાન્ઝેક્શન ખર્ચ પણ મહત્વનો છે.",
    help:
      "હું લિક્વિડિટી, ગોલ્ડ કોન્ટ્રાક્ટ, જોખમ વિશ્લેષણ અને બેકટેસ્ટિંગ સમજાવી શકું છું. આ લોકલ ડેમો આસિસ્ટન્ટ છે, લાઇવ AI સેવા નથી.",
    unknown:
      "હું લોકલ ડેમો આસિસ્ટન્ટ છું. લિક્વિડિટી, ગોલ્ડ કોન્ટ્રાક્ટ, જોખમ વિશ્લેષણ અથવા બેકટેસ્ટિંગ વિશે પૂછો. હાલમાં મારી પાસે લાઇવ માર્કેટ ભાવ અથવા AI API કનેક્શન નથી.",
  },
  ta: {
    liquidity:
      "லிக்விடிட்டி என்பது ஒரு கமாடிட்டி ஒப்பந்தத்தை அதன் விலையில் பெரிய மாற்றமின்றி எவ்வளவு எளிதாக வாங்க அல்லது விற்க முடியும் என்பதைக் குறிக்கிறது. ஒப்பந்தங்களை ஒப்பிட டாஷ்போர்டின் லிக்விடிட்டி பகுப்பாய்வைப் பாருங்கள்.",
    risk:
      "கமாடிட்டி ஃபியூச்சர்ஸில் விலை மற்றும் மார்ஜின் ஆபத்துகள் உள்ளன. வர்த்தக முடிவெடுப்பதற்கு முன் ரிஸ்க் பகுப்பாய்வு மற்றும் மார்ஜின் விவரங்களைப் பாருங்கள்.",
    gold:
      "டாஷ்போர்டில் GOLDM, GOLDTEN, GOLDGUINEA மற்றும் GOLDPETAL ஒப்பந்தங்களை ஒப்பிடலாம். இது வரலாற்றுத் தரவு பகுப்பாய்வு மட்டுமே; உறுதியான வர்த்தகக் குறிப்பு அல்ல.",
    backtest:
      "பேக்டெஸ்டிங் என்பது கடந்தகாலத் தரவைப் பயன்படுத்தி ஒரு வர்த்தக உத்தியைச் சோதிப்பதாகும். கடந்தகால முடிவுகள் எதிர்கால லாபத்திற்கு உத்தரவாதமல்ல. பரிவர்த்தனைச் செலவுகளும் முக்கியம்.",
    help:
      "லிக்விடிட்டி, தங்க ஒப்பந்தங்கள், ரிஸ்க் பகுப்பாய்வு மற்றும் பேக்டெஸ்டிங் பற்றி விளக்க முடியும். இது உள்ளூர் டெமோ உதவியாளர்; நேரடி AI சேவை அல்ல.",
    unknown:
      "நான் உள்ளூர் டெமோ உதவியாளர். லிக்விடிட்டி, தங்க ஒப்பந்தங்கள், ரிஸ்க் பகுப்பாய்வு அல்லது பேக்டெஸ்டிங் பற்றி கேளுங்கள். தற்போது நேரடி சந்தை விலைகளோ AI API இணைப்போ இல்லை.",
  },
};

export async function askAssistant(
  request: AssistantRequest
): Promise<AssistantResponse> {
  const question = request.question.toLowerCase();

  let topic: string;

  if (
    /liquid|volume|liquidity|લિક્વિડિટી|तरलता|लिक्विडिटी|லிக்விடிட்டி/.test(
      question
    )
  ) {
    topic = "liquidity";
  } else if (
    /risk|margin|exposure|જોખમ|जोखिम|मार्जिन|ஆபத்து|மார்ஜின்/.test(
      question
    )
  ) {
    topic = "risk";
  } else if (
    /gold|goldm|goldten|goldguinea|goldpetal|સોનું|सोना|தங்கம்/.test(
      question
    )
  ) {
    topic = "gold";
  } else if (
    /backtest|back test|historical return|બેકટેસ્ટ|बैकटेस्ट|பேக்டெஸ்ட்/.test(
      question
    )
  ) {
    topic = "backtest";
  } else if (
    /help|what can you|કેમ મદદ|मदद|உதவி/.test(question)
  ) {
    topic = "help";
  } else {
    topic = "unknown";
  }

  return {
    status: "ok",
    answer: REPLIES[request.language][topic],
  };
}