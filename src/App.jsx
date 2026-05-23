import { useState, useRef, useEffect, useCallback } from "react";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧", color: "#3B82F6", bcp: "en-US", mm: "en-GB" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", color: "#F59E0B", bcp: "hi-IN", mm: "hi-IN" },
  { code: "fr", name: "French", flag: "🇫🇷", color: "#EF4444", bcp: "fr-FR", mm: "fr-FR" },
  { code: "es", name: "Spanish", flag: "🇪🇸", color: "#10B981", bcp: "es-ES", mm: "es-ES" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", color: "#8B5CF6", bcp: "mr-IN", mm: "mr-IN" },
  { code: "de", name: "German", flag: "🇩🇪", color: "#EC4899", bcp: "de-DE", mm: "de-DE" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", color: "#F97316", bcp: "ja-JP", mm: "ja-JP" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", color: "#06B6D4", bcp: "zh-CN", mm: "zh-CN" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", color: "#84CC16", bcp: "ar-SA", mm: "ar-SA" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", color: "#A78BFA", bcp: "pt-BR", mm: "pt-BR" },
  { code: "ru", name: "Russian", flag: "🇷🇺", color: "#FB923C", bcp: "ru-RU", mm: "ru-RU" },
  { code: "ko", name: "Korean", flag: "🇰🇷", color: "#34D399", bcp: "ko-KR", mm: "ko-KR" },
  { code: "it", name: "Italian", flag: "🇮🇹", color: "#F43F5E", bcp: "it-IT", mm: "it-IT" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", color: "#14B8A6", bcp: "tr-TR", mm: "tr-TR" },
  { code: "bn", name: "Bengali", flag: "🇧🇩", color: "#FBBF24", bcp: "bn-BD", mm: "bn-BD" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", color: "#60A5FA", bcp: "ta-IN", mm: "ta-IN" },
];

const NON_LATIN = ["hi", "mr", "ja", "zh", "ar", "ru", "ko", "bn", "ta"];

const INITIAL_WINDOWS = [
  { id: 1, langCode: "en", isInput: true },
  { id: 2, langCode: "mr", isInput: false },
  { id: 3, langCode: "fr", isInput: false },
  { id: 4, langCode: "es", isInput: false },
];

function getLang(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

async function translateText(text, targetLang, sourceLang = "en") {
  if (!text.trim()) return { translation: "", pronunciation: "" };
  if (targetLang === sourceLang) return { translation: text, pronunciation: "" };
  const src = getLang(sourceLang).mm;
  const tgt = getLang(targetLang).mm;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;
    const res = await fetch(url);
    const data = await res.json();
    const translation = data?.responseData?.translatedText || "";
    let pronunciation = "";
    if (NON_LATIN.includes(targetLang) && translation) {
      try {
        const romUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(translation)}&langpair=${tgt}|en-GB`;
        const romRes = await fetch(romUrl);
        const romData = await romRes.json();
        const match = romData?.matches?.[0];
        if (match?.translation) pronunciation = match.translation;
      } catch { pronunciation = ""; }
    }
    return { translation, pronunciation };
  } catch {
    return { translation: "Translation failed. Check your connection.", pronunciation: "" };
  }
}

function speak(text, bcp) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = bcp;
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}

function LanguageSelector({ current, onSelect, usedCodes }) {
  const [open, setOpen] = useState(false);
  const lang = getLang(current);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.08)", border: `1.5px solid ${lang.color}44`,
        borderRadius: 10, padding: "6px 12px", cursor: "pointer",
        color: "#fff", fontSize: 13, fontFamily: "'Sora', sans-serif", transition: "all 0.2s",
      }}>
        <span style={{ fontSize: 18 }}>{lang.flag}</span>
        <span style={{ color: lang.color, fontWeight: 600 }}>{lang.name}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 100,
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: 6, minWidth: 175,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)", maxHeight: 300, overflowY: "auto",
        }}>
          {LANGUAGES.map((l) => {
            const disabled = usedCodes.includes(l.code) && l.code !== current;
            return (
              <button key={l.code} disabled={disabled}
                onClick={() => { onSelect(l.code); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  background: l.code === current ? `${l.color}22` : "transparent",
                  border: "none", borderRadius: 8, padding: "8px 10px",
                  cursor: disabled ? "not-allowed" : "pointer",
                  color: disabled ? "rgba(255,255,255,0.25)" : "#fff",
                  fontSize: 13, fontFamily: "'Sora', sans-serif", textAlign: "left",
                }}>
                <span>{l.flag}</span>
                <span style={{ color: disabled ? "rgba(255,255,255,0.25)" : l.color, fontWeight: 600 }}>{l.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LangWindow({ win, windows, inputText, onLangChange, onSetInput, onTextChange, translations, loading }) {
  const lang = getLang(win.langCode);
  const usedCodes = windows.map((w) => w.langCode);
  const isInput = win.isInput;
  const result = translations[win.id] || { translation: "", pronunciation: "" };
  const displayText = isInput ? inputText : result.translation;
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: `1.5px solid ${lang.color}33`,
      borderRadius: 18, display: "flex", flexDirection: "column",
      overflow: "hidden", flex: 1, minWidth: 0,
      boxShadow: isInput ? `0 0 30px ${lang.color}22` : "none", transition: "box-shadow 0.3s",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderBottom: `1px solid ${lang.color}22`,
        background: `linear-gradient(135deg, ${lang.color}11 0%, transparent 100%)`,
      }}>
        <LanguageSelector current={win.langCode} onSelect={(code) => onLangChange(win.id, code)} usedCodes={usedCodes} />
        <div style={{ display: "flex", gap: 6 }}>
          {!isInput ? (
            <button onClick={() => onSetInput(win.id)} style={{
              background: `${lang.color}22`, border: `1px solid ${lang.color}44`,
              borderRadius: 7, padding: "4px 9px", cursor: "pointer",
              color: lang.color, fontSize: 11, fontFamily: "'Sora', sans-serif", fontWeight: 600,
            }}>✏️ Type here</button>
          ) : (
            <span style={{
              background: `${lang.color}22`, border: `1px solid ${lang.color}55`,
              borderRadius: 7, padding: "4px 9px", color: lang.color,
              fontSize: 11, fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: 0.5,
            }}>INPUT</span>
          )}
        </div>
      </div>
      <div style={{ flex: 1, padding: 16, minHeight: 130 }}>
        {isInput ? (
          <textarea value={inputText} onChange={(e) => onTextChange(e.target.value)}
            placeholder={`Type in ${lang.name}...`}
            style={{
              width: "100%", height: "100%", minHeight: 120, background: "transparent",
              border: "none", outline: "none", color: "#fff", fontSize: 16,
              fontFamily: "'Sora', sans-serif", resize: "none", lineHeight: 1.7,
            }} />
        ) : loading[win.id] ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center", paddingTop: 10 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: lang.color,
                animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
              }} />
            ))}
          </div>
        ) : (
          <>
            <p style={{ color: "#fff", fontSize: 16, lineHeight: 1.7, fontFamily: "'Sora', sans-serif", margin: 0 }}>
              {displayText || <span style={{ color: "rgba(255,255,255,0.2)" }}>Translation appears here...</span>}
            </p>
            {result.pronunciation && (
              <p style={{
                color: lang.color, fontSize: 12, lineHeight: 1.6,
                fontFamily: "'Sora', sans-serif", margin: "10px 0 0", fontStyle: "italic", opacity: 0.75,
              }}>🔤 {result.pronunciation}</p>
            )}
          </>
        )}
      </div>
      {displayText && !loading[win.id] && (
        <div style={{
          padding: "10px 16px", borderTop: `1px solid ${lang.color}1a`,
          display: "flex", justifyContent: "flex-end",
        }}>
          <button onClick={() => speak(displayText, lang.bcp)} style={{
            background: `${lang.color}22`, border: `1px solid ${lang.color}55`,
            borderRadius: 8, padding: "6px 14px", cursor: "pointer",
            color: lang.color, fontSize: 13, fontFamily: "'Sora', sans-serif",
            fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
          }}>🔊 Listen</button>
        </div>
      )}
    </div>
  );
}

export default function PolyPane() {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [inputText, setInputText] = useState("");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState({});
  const [isListening, setIsListening] = useState(false);
  const debounceRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputWindow = windows.find((w) => w.isInput);

  const runTranslations = useCallback(async (text, inputLang) => {
    if (!text.trim()) { setTranslations({}); return; }
    const targets = windows.filter((w) => !w.isInput);
    const newLoading = {};
    targets.forEach((w) => { newLoading[w.id] = true; });
    setLoading(newLoading);
    await Promise.all(targets.map(async (w) => {
      const result = await translateText(text, w.langCode, inputLang);
      setTranslations((prev) => ({ ...prev, [w.id]: result }));
      setLoading((prev) => ({ ...prev, [w.id]: false }));
    }));
  }, [windows]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runTranslations(inputText, inputWindow?.langCode || "en");
    }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [inputText, inputWindow?.langCode]);

  const handleLangChange = (id, code) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, langCode: code } : w));
    setTranslations({});
    setTimeout(() => runTranslations(inputText, inputWindow?.langCode || "en"), 100);
  };

  const handleSetInput = (id) => {
    setWindows((prev) => prev.map((w) => ({ ...w, isInput: w.id === id })));
    setInputText(""); setTranslations({});
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser. Try Chrome."); return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = getLang(inputWindow?.langCode || "en").bcp;
    rec.continuous = false; rec.interimResults = false;
    rec.onresult = (e) => { setInputText(e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start(); setIsListening(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F2F0EF 0%, #E8E5E0 50%, #EDF2EE 100%)",
      fontFamily: "'Space Grotesk', sans-serif", padding: "0 0 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 70%{box-shadow:0 0 0 12px rgba(239,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} }
        *{box-sizing:border-box}
        textarea{caret-color:white}
        textarea::placeholder{color:rgba(255,255,255,0.2)!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
      `}</style>
      <div style={{
        padding: "28px 32px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between", animation: "fadeIn 0.5s ease",
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5,
            background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>PolyPane</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Type once. See 4 languages instantly. — 100% Free, No API Key
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {inputText && (
            <button onClick={() => { setInputText(""); setTranslations({}); }} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "8px 16px", cursor: "pointer",
              color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'Sora', sans-serif",
            }}>✕ Clear</button>
          )}
          <button onClick={handleVoice} style={{
            background: isListening ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
            border: isListening ? "1.5px solid #EF4444" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "8px 18px", cursor: "pointer",
            color: isListening ? "#EF4444" : "rgba(255,255,255,0.6)",
            fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: 600,
            display: "flex", alignItems: "center", gap: 7,
            animation: isListening ? "pulse-ring 1.2s infinite" : "none", transition: "all 0.2s",
          }}>{isListening ? "⏹ Stop" : "🎤 Speak"}</button>
        </div>
      </div>
      <div style={{ padding: "12px 32px 0" }}>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          💡 Click <strong style={{ color: "rgba(255,255,255,0.35)" }}>✏️ Type here</strong> on any window to use it as input &nbsp;·&nbsp;
          Powered by <strong style={{ color: "rgba(255,255,255,0.35)" }}>MyMemory</strong> — free forever, no sign-up
        </p>
      </div>
      <div style={{
        display: "flex", gap: 16, padding: "20px 32px 0",
        alignItems: "stretch", flexWrap: "wrap", animation: "fadeIn 0.7s ease",
      }}>
        {windows.map((win) => (
          <div key={win.id} style={{ flex: "1 1 220px", minWidth: 0, display: "flex" }}>
            <LangWindow win={win} windows={windows} inputText={inputText}
              onLangChange={handleLangChange} onSetInput={handleSetInput}
              onTextChange={setInputText} translations={translations} loading={loading} />
          </div>
        ))}
      </div>
      <div style={{ padding: "24px 32px 0", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5 }}>
          POLYPANE · mitraverse.live/polypane · No API key · No cost · Forever free
        </p>
      </div>
    </div>
  );
}
