// Object-Oriented approach to handle magnification, zooming, and text reading

class Magnifier {
    constructor() {
        this.zoomLevel = 8; // Magnify by 8x
    }

    enableMagnifier() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: this.applyMagnification,
                args: [this.zoomLevel] // Pass the zoom level to the script
            });
        });
    }

    disableMagnifier() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: this.removeMagnification
            });
        });
    }

    // Function to apply magnification on hover
    applyMagnification(zoomLevel) {
        document.body.style.cursor = 'zoom-in';

        const handleMouseOver = (event) => {
            const target = event.target;
            if (target.tagName === 'P' || target.tagName.startsWith('H') || target.tagName === 'SPAN' || target.tagName === 'DIV') {
                target.style.transform = `scale(${zoomLevel})`;
                target.style.transition = 'transform 0.3s ease';
            }
        };

        const handleMouseOut = (event) => {
            const target = event.target;
            if (target.style.transform) {
                target.style.transform = 'scale(1)';
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
    }

    // Function to remove magnification
    removeMagnification() {
        document.body.style.cursor = 'default';
        const allElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
        allElements.forEach((element) => {
            element.style.transform = 'scale(1)';
        });
    }
}

// Text-to-Speech and Notepad functionality
class TextReader {
    constructor() {}

    readSelectedText() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            // Ensuring text-to-speech functionality works
            chrome.tts.speak(selectedText, { rate: 1.0 });
        } else {
            alert('Please select some text to read.');
        }
    }

    openInNotepad(text) {
        const newWindow = window.open('', '_blank', 'width=400,height=400');
        newWindow.document.write(`
            <style>
                body { font-size: 2em; letter-spacing: 0.12em; line-height: 1.5; padding: 20px; }
            </style>
            <pre>${text}</pre>
        `);
    }
}

// Instantiate objects for each feature
const magnifier = new Magnifier();
const textReader = new TextReader();

// Event listeners for popup buttons
document.getElementById('magnifyButton').addEventListener('click', () => {
    magnifier.enableMagnifier();
});

document.getElementById('readTextButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                const selectedText = window.getSelection().toString();
                if (selectedText) {
                    chrome.runtime.sendMessage({ action: "readText", text: selectedText });
                } else {
                    alert('Please select some text to read.');
                }
            }
        });
    });
});

document.getElementById('spacingButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                const selectedText = window.getSelection();
                if (!selectedText.rangeCount) return;

                const range = selectedText.getRangeAt(0);
                const span = document.createElement('span');
                span.style.fontSize = '1.5em';
                span.style.letterSpacing = '0.12em';
                span.style.lineHeight = '1.5';
                span.textContent = selectedText.toString();

                range.deleteContents();
                range.insertNode(span);
            }
        });
    });
});
