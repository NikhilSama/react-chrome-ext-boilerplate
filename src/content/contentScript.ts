console.log('content script loaded')

chrome.runtime.sendMessage("From the content script", (response) => {
    console.log(response)
})