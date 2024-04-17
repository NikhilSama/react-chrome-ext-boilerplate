console.log('content script Loaded and sending message to Popup script')

chrome.runtime.sendMessage({
    html: document.documentElement.innerHTML
});
