import { useEffect, useRef, useState } from "react";
import { createWorker } from "tesseract.js";

interface ProcessingProps{
    imageData: string;
    onTextFound: (text: string) => void;
    onNoTextFound: () => void;
    onError: (message: string) => void;
}

export default function Processing({imageData, onTextFound, onNoTextFound, onError,} : ProcessingProps) {
    const [statusMessage, setStatusMessage] = useState("Starting...");
    const hasStarted = useRef(false);

    useEffect(()=>{
        if(hasStarted.current) return;
        hasStarted.current = true;
        runOCR();
    }, []);

    const runOCR = async () => {
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

           const { data } = await worker.recognize(
            imageData,
            {}, 
            { blocks: true }
            );
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
            (word) => word.confidence >= CONFIDENCE_THRESHOLD && word.text.trim().length > 1
            );

            const cleanedText = reliableWords.map((w) => w.text).join(" ").trim();

            if (cleanedText.length >= 3) {
                onTextFound(cleanedText);
            } 
            else 
            {
                onNoTextFound();
            } 
        }catch(err){
            console.error("OCR failed: ",err);
            onError("Something went wrong while reading the image");
        }
    }

    return(
        <div className="processing-screen">
            <p>{statusMessage}</p>
        </div>
    );
}