import { Camera } from "@capacitor/camera";
import { useEffect, useState } from "react";

interface CaptureProps {
    onCaptured: (ImageDataUrl: string) => void;
    onCancel: () => void;
}

export default function Capture({onCaptured, onCancel} : CaptureProps) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        takePhoto();
    }, []);

    const takePhoto = async () => {
        setError(null);
        try{
            const result = await Camera.takePhoto({
                quality: 80,
                includeMetadata: true,
            });
            if(result.thumbnail && result.metadata?.format){
                const dataUrl = `data:image/${result.metadata.format};base64,${result.thumbnail}`;
                onCaptured(dataUrl);
            }
            else{
                setError("No image data returned. Try again.");
            }
        }
        catch(err){
            setError("Camera was closed or permission was denied");
        }
    }

    return(
        <div className="capture-screen">
            <p>Opening camera...</p>
            {error && 
                <div className="capture-error">
                    <p>{error}</p>       
                    <button onClick={takePhoto}>Try Again</button>
                    <button onClick={onCancel}>Back to Home</button>
                </div>
            }
        </div>
    );

}