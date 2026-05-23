# 🌐 PolyPane — Multi-Language Simultaneous Translator

> Type once. See 4 languages instantly — with pronunciation and audio.

Inspired by PhoneArena's side-by-side phone comparison, PolyPane lets you compare translations across multiple languages simultaneously. Perfect for language learners, travelers, and polyglots.

---

## ✨ Features

- **4 language windows** — all update in real time as you type
- **12 languages** — English, Hindi, Marathi, French, Spanish, German, Japanese, Chinese, Arabic, Portuguese, Russian, Korean
- **Phonetic pronunciation** — romanized guide for non-Latin scripts
- **🔊 Listen** — native text-to-speech for every language
- **🎤 Speak** — voice input via microphone (Chrome recommended)
- **Switch input language** — click "✏️ Type here" on any window
- **PWA ready** — installable as an app on desktop and mobile

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- An [Anthropic API key](https://console.anthropic.com/)

### 2. Install dependencies
```bash
npm install
```

### 3. Run in development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production
```bash
npm run build
npm run preview
```

---

## 📱 Install as an App (PWA)

Once running in Chrome or Edge:
- **Desktop:** Click the install icon (⊕) in the address bar
- **Android:** Tap the browser menu → "Add to Home Screen"
- **iPhone:** Tap Share → "Add to Home Screen"

---

## 🗂️ Project Structure

```
polypane/
├── public/
│   └── favicon.svg          # App icon
├── src/
│   ├── App.jsx              # Main app component
│   └── main.jsx             # React entry point
├── index.html               # HTML shell
├── vite.config.js           # Vite + PWA config
├── package.json             # Dependencies
├── .env.example             # API key template
└── README.md                # This file
```

---

## 🆓 No API Key Needed

This app uses the **MyMemory Translation API** — completely free, no sign-up, no key required.
- Free limit: 5,000 words/day (plenty for personal/charity use)
- For higher limits, optionally register a free email at mymemory.translated.net to get 50,000 words/day

---

## 🛠️ Built With

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Claude API](https://docs.anthropic.com/) — translation engine
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — voice input & text-to-speech
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — PWA support

---

## 💡 Idea Credit

Inspired by [PhoneArena](https://www.phonearena.com/phones/benchmarks)'s multi-phone comparison UI — same concept applied to languages.

---

Made with ❤️ using Claude AI
