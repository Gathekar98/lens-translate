import { useState } from "react";
import "./App.css";

type Stage = "home" | "capturing" | "processing" | "result";
type OutputMode = "speak" | "text";

function App() {
  const [stage, setStage] = useState<Stage>("home");
  const [outputMode, setOutputMode] = useState<OutputMode>("text");
  const [targetLanguage, setTargetLanguage] = useState<string>("en");

  return (
    <div className="app">
      {stage === "home" && <div>HOME SCREEN (placeholder)</div>}
      {stage === "capturing" && <div>CAPTURING (placeholder)</div>}
      {stage === "processing" && <div>PROCESSING (placeholder)</div>}
      {stage === "result" && <div>RESULT (placeholder)</div>}
    </div>
  );
}

export default App;