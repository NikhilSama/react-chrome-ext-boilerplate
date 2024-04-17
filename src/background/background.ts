// ts script has no react; can convert to react with tsx
console.log('background script loaded')

function sendHtmlToPopup() {
    console.log("Sending message to Popup script")
    chrome.runtime.sendMessage({
        html: document.documentElement.innerHTML
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Cant use SendREsponse here cause 
    //because the document object is not available in the background script. 
    //The document object is part of the DOM (Document Object Model), and it's 
    //only available in the context of a web page, i.e., in content scripts or 
    // injected into a web page.

    //sendResponse("From the background script")

    if (message.action === "executeScript") {
        console.log("Executing script")
        
        chrome.scripting.executeScript({
            target: {tabId: message.tabId},
            func: sendHtmlToPopup
            // files: [message.file]
        }).then(() => {
            console.log("Script Injected")
        });        
    }
})