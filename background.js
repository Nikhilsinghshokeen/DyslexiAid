chrome.contextMenus.create({
  id: "readText",
  title: "Read highlighted text",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "readText" && info.selectionText) {
    chrome.tts.speak(info.selectionText, {
      voiceName: "Google US English",
      rate: 1.0,
      pitch: 1.0
    });
  }
});
