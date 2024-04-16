// ts script has no react; can convert to react with tsx
console.log('background script loaded')
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    console.log(sender)
    sendResponse("From the background script")
})