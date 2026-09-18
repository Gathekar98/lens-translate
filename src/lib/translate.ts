interface TranslateResult {
    translatedText: string;
}

export async function translateText(text: string, targetLang: string, sourceLang: string = "en") : Promise<TranslateResult> {
    const langpair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Translation request failed: ${response.status}`);
    }
    const data = await response.json();

    if(data.responseStatus !== 200) {
        throw new Error(data.responseDetails || "Translation failed");
    }
    return{
        translatedText: data.responseData.translatedText,
    };
}