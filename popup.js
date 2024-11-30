document.getElementById('toggleDyslexiaFont').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDyslexiaFont' }, (response) => {
      console.log(response.status);
    });
  });
});
