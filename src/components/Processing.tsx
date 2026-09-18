import { useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { translateText } from "../lib/translate";
import "@tensorflow/tfjs";

function loadImage(dataUrl: string) : Promise<HTMLImageElement>{
    return new Promise((resolve, reject) =>{
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image for classification."));
        img.src = dataUrl;
    });
}

interface ProcessingProps{
    imageData: string;
    targetLanguage: string;
    onTranslated: (original: string, translated: string) => void;
    onNothingFound: () => void;
    onError: (message: string) => void;
}

export default function Processing({imageData, targetLanguage, onTranslated, onNothingFound, onError,} : ProcessingProps) {
    const [statusMessage, setStatusMessage] = useState("Starting...");
    const hasStarted = useRef(false);

    useEffect(()=>{
        if(hasStarted.current) return;
        hasStarted.current = true;
        runPipeline();
    }, []);

    const runPipeline = async () => {
        const foundText = await runOCR();
        const recognizedText = foundText ?? (await runObjectRecognitionAndGetLabel());

        if (!recognizedText) {
            onNothingFound();
            return;
        }

        await translateAndFinish(recognizedText);
    };

    const runOCR = async (): Promise<string | null> => {
        try{
            setStatusMessage("Loading text recognition engine...");

            const worker = await createWorker("eng",1, {
                logger:(m) => {
                    if(m.status === "recognizing text"){
                        setStatusMessage(`Reading text... ${Math.round(m.progress * 100)}%`);
                    }else{
                        setStatusMessage(m.status);
                    }
                },
            });

           const { data } = await worker.recognize(imageData, {}, { blocks: true });
            await worker.terminate();

            type Word = { text: string; confidence: number };

            const allWords: Word[] = [];
            for (const block of data.blocks ?? []) {
                for (const paragraph of block.paragraphs ?? []) {
                    for (const line of paragraph.lines ?? []) {
                        for (const word of line.words ?? []) {
                            allWords.push({ text: word.text, confidence: word.confidence });
                        }
                    }
                }
            }

            const CONFIDENCE_THRESHOLD = 60;

            const reliableWords = allWords.filter(
            (w) => w.confidence >= CONFIDENCE_THRESHOLD && w.text.trim().length > 1
            );

            const cleanedText = reliableWords.map((w) => w.text).join(" ").trim();
            return cleanedText.length >= 3 ? cleanedText : null;
        }catch(err){
            console.error("OCR failed: ",err);
            return null;
        }
    };

    const runObjectRecognitionAndGetLabel = async (): Promise<string | null> => {
        try {
            setStatusMessage("No text found — identifying object...");
            const model = await mobilenet.load();

            setStatusMessage("Analyzing image...");
            const imgElement = await loadImage(imageData);
            const predictions = await model.classify(imgElement);

            if (predictions.length > 0 && predictions[0].probability > 0.15) {
            return predictions[0].className.split(",")[0].trim();
            }
            return null;
        } catch (err) {
            console.error("Object recognition failed:", err);
            return null;
        }
    };

    const translateAndFinish = async (recognizedText: string) => {
        try {
            setStatusMessage("Translating...");
            const { translatedText } = await translateText(recognizedText, targetLanguage);
            onTranslated(recognizedText, translatedText);
        } catch (err) {
            console.error("Translation failed:", err);
            onError("Recognition worked, but translation failed. Please try again.");
        }
    };

    return(
        <div className="processing-screen">
            <p>{statusMessage}</p>
        </div>
    );
}