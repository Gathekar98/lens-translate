import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Capture from "./components/Capture";

type Stage = "home" | "capturing" | "processing" | "result";
export type OutputMode = "speak" | "text";

function App() {
  const [stage, setStage] = useState<Stage>("home");
  const [outputMode, setOutputMode] = useState<OutputMode>("text");
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <div className="app">
      {stage === "home" && 
        <Home 
          targetLanguage={targetLanguage}
          setTargetLanguage={setTargetLanguage}
          outputMode={outputMode}
          setOutputMode={setOutputMode}
          onScan={()=>setStage("capturing")}
        />
      }
      {stage === "capturing" && (
        <Capture
          onCaptured={(img) => {
            setCapturedImage(img);
            setStage("processing");
          }}  
          onCancel={()=> setStage("home")}
        />
      )}
      {stage === "processing" && <div>PROCESSING (placeholder)</div>}
      {stage === "result" && <div>RESULT (placeholder)</div>}
    </div>
  );
}

export default App;