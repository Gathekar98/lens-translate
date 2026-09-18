import { useEffect, useRef } from "react";
import type { OutputMode } from "../App";

interface ResultProps {
  originalText: string;
  translatedText: string;
  outputMode: OutputMode;
  targetLanguage: string;
  onScanAgain: () => void;
}

export default function Result({
  originalText,
  translatedText,
  outputMode,
  targetLanguage,
  onScanAgain,
}: ResultProps) {
  const hasSpoken = useRef(false);

  useEffect(() => {
    if (outputMode === "speak" && !hasSpoken.current) {
      hasSpoken.current = true;
      speak(translatedText, targetLanguage);
    }
  }, [outputMode, translatedText, targetLanguage]);

  const speak = (text: string, lang: string) => {
    // Guard: not every browser/webview supports SpeechSynthesis
    // (this matters especially once wrapped in a Capacitor WebView on Android).
    if (!("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis not supported in this environment.");
      return;
    }

    // Cancel any speech already in progress before starting new speech,
    // to avoid overlapping audio if the user scans multiple times quickly.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // e.g. "es", "ja" — helps the browser pick a matching voice
    window.speechSynthesis.speak(utterance);
  };

  const handleReplay = () => {
    speak(translatedText, targetLanguage);
  };

  return (
    <div className="result-screen">
      <div className="result-original">
        <span className="result-label">Detected:</span>
        <p>{originalText || "—"}</p>
      </div>

      <div className="result-translated">
        <span className="result-label">Translation:</span>
        <p>{translatedText}</p>
      </div>

      {outputMode === "speak" && (
        <button onClick={handleReplay}>🔊 Replay</button>
      )}

      <button onClick={onScanAgain}>Scan Again</button>
    </div>
  );
}