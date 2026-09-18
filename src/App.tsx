import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Capture from "./components/Capture";
import Processing from "./components/Processing";

type Stage = "home" | "capturing" | "processing" | "result";
export type OutputMode = "speak" | "text";

function App() {
  const [stage, setStage] = useState<Stage>("home");
  const [outputMode, setOutputMode] = useState<OutputMode>("text");
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");

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
      {stage === "processing" && capturedImage && ( 
        <Processing 
          imageData={capturedImage}
          targetLanguage={targetLanguage}
          onTranslated={(original, translated) => {
            setRecognizedText(original);
            setTranslatedText(translated);
            setStage("result");
          }}
          onNothingFound={()=> {
            setRecognizedText("Couldn't recognize any text or object. Try again with better lighting or a closer shot.");
            setStage("result");
          }}
          onError={(msg)=>{
            setRecognizedText(`Error: ${msg}`);
            setStage("result");
          }}
        />
      )}
      {stage === "result" && (
        <div>
          <p>RESULT (original): {recognizedText}</p>
          <p>RESULT (translated): {translatedText}</p>
        </div>
      )}
    </div>
  );
}

export default App;