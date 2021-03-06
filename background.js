// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     // console.log('updated');
//     if(tab.url.indexOf('twitch.tv') >= 0)
//         chrome.tabs.sendMessage(tab.id,1);
//     else
//         console.log('n');
// });
//
// chrome.browserAction.onClicked.addListener(buttonClicked);
//
// function buttonClicked(tab) {
//     if(tab.url.indexOf('twitch.tv') >= 0)
//         chrome.tabs.sendMessage(tab.id,1);
//     else
//         console.log('n');
// }

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        let storage = localStorage.getItem(message.request);
        sendResponse({storage:storage});
    }
);