import type { OutputMode } from "../App";

const LANGUAGES: { code: string; label: string }[] = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "hi", label: "Hindi" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
];

interface HomeProps{
    targetLanguage: string;
    setTargetLanguage: (lang: string) => void;
    outputMode: OutputMode;
    setOutputMode: (mode: OutputMode) => void;
    onScan: () => void;
}

export default function Home({
    targetLanguage,
    setTargetLanguage,
    outputMode,
    setOutputMode,
    onScan,
}: HomeProps){
    return(
        <div className="home-screen">
            <h1>Lens Translate</h1>

            <label htmlFor="lang-select">Translate into</label>
            <select 
                name="lang-select" 
                id="lang-select"
                value={targetLanguage}
                onChange={(e)=> setTargetLanguage(e.target.value)}
            >
                {LANGUAGES.map((lang) => (
                    <option value={lang.code} key={lang.code}>
                        {lang.code}
                    </option>
                ))}
            </select>

            <fieldset>
                <legend>Output</legend>
                <label>
                    <input 
                        type="radio" 
                        name="outputMode"
                        value="speak"
                        checked={outputMode === "speak"}
                        onChange={()=> setOutputMode("speak")}
                    />
                    Speak it
                </label>
                <label>
                    <input 
                        type="radio"
                        name="outputMode"
                        value="text"
                        checked={outputMode === "text"}
                        onChange={()=> setOutputMode("text")}
                    />
                    Show text
                </label>
                <button onClick={onScan}>Scan</button>
            </fieldset>
        </div>
    );
}