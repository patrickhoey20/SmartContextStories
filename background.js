chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.url) {
        console.log(message.url)
    }
});