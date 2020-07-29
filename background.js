"use strict";
// Special thanks to FA for the two icons

chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ plugin_is_on: false });
});

// chrome.browserAction.onClicked.addListener((tab) => {
//     chrome.tabs.query({}, function (tabs) {
//         var message = { action: "updatePageMode" };
//         for (var i = 0; i < tabs.length; ++i) {
//             chrome.tabs.sendMessage(tabs[i].id, message);
//         }
//     });
//     chrome.storage.sync.get(["plugin_is_on"], function (data) {
//         // alert(data.plugin_is_on)
//         if (data.plugin_is_on === true) {
//             chrome.storage.sync.set({ plugin_is_on: false });
//             chrome.browserAction.setIcon({ path: { "16": "icons/off.png" } });
//         } else {
//             chrome.storage.sync.set({ plugin_is_on: true });
//             chrome.browserAction.setIcon({ path: { "16": "icons/on.png" } });
//         }
//     });
// });

chrome.runtime.onInstalled.addListener(() => {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { hostEquals: "developer.chrome.com" },
					}),
				],
				actions: [new chrome.declarativeContent.ShowPageAction()],
			},
		]);
	});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("sending request");
	if (request.contentScriptQuery == "annotateText") {
		$.ajax({
			method: "POST",
			url: "https://researchy-api.herokuapp.com/",
			data: request,
			success: function (data, status, xhr) {
				console.log(data);
				console.log(xhr);
				sendResponse([data, status, xhr]);
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr);
				console.log(textStatus);
				console.log(errorThrown);
				sendResponse(["", status, xhr]);
			},
		}).done(function (data) {
			console.log(data);
		});

		return true;
	}
});
