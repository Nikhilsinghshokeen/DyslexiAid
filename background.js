chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "readText") {
        chrome.tts.speak(message.text, { rate: 1.0 });
    }
});
