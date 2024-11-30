let isDyslexiaModeOn = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleDyslexiaFont") {
    isDyslexiaModeOn = !isDyslexiaModeOn;

    if (isDyslexiaModeOn) {
      const fontUrl = chrome.runtime.getURL("fonts/OpenDyslexic-Regular.otf");
      const style = document.createElement('style');
      style.id = 'dyslexiaStyle';
      style.textContent = `
        @font-face {
          font-family: 'OpenDyslexic';
          src: url(${fontUrl}) format('opentype');
        }
        body, p, span, div, h1, h2, h3, h4, h5, h6, a, li, td, th {
          font-family: 'OpenDyslexic', sans-serif !important;
          font-size: 20px !important;
          letter-spacing: 0.15em !important;
          line-height: 1.6em !important;
          font-weight: bold !important;
        }
      `;
      document.head.appendChild(style);
      console.log("Dyslexia-friendly font applied.");
      sendResponse({ status: "Dyslexia mode enabled" });
    } else {
      const existingStyle = document.getElementById('dyslexiaStyle');
      if (existingStyle) existingStyle.remove();
      console.log("Dyslexia-friendly font removed.");
      sendResponse({ status: "Dyslexia mode disabled" });
    }
    return true;
  }

  if (request.action === "readText") {
    if (request.text && request.text.trim() !== "") {
      chrome.tts.speak(request.text, {
        voiceName: 'Google US English',
        rate: 1.0,
        pitch: 1.0,
        onEvent: (event) => {
          if (event.type === "start") {
            console.log("TTS started.");
          } else if (event.type === "end") {
            console.log("TTS completed.");
            sendResponse({ status: "TTS completed" });
          } else if (event.type === "error") {
            console.error("TTS error:", event.errorMessage);
            sendResponse({ status: "TTS error", error: event.errorMessage });
          }
        }
      });
    } else {
      alert("Please highlight text to read aloud.");
      console.warn("No text selected for TTS.");
      sendResponse({ status: "no text selected" });
    }
    return true;
  }
});
