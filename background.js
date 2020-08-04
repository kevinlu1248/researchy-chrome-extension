"use strict";
const API_URL = "http://64.225.115.179/api";

chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ plugin_is_on: false, include_list: [] });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("sending request with request", request);
	if (request.contentScriptQuery == "annotateText") {
		$.ajax({
			method: "POST",
			url: API_URL,
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
	} else if (request.contentScriptQuery == "updateTabStatus") {
		// message all tabs to update page
		chrome.storage.sync.get("include_list", (res) => {
			chrome.tabs.query({}, function (tabs) {
				var message = {
					action: "updatePageMode",
					include_list: res.include_list,
				};
				for (var i = 0; i < tabs.length; ++i) {
					chrome.tabs.sendMessage(tabs[i].id, message);
				}
			});
		});
	} else if (request.contentScriptQuery == "readFile") {
		$.ajax({
			url: chrome.extension.getURL(request.fileName),
			dataType: "html",
			success: sendResponse,
		});
		return true;
	}
});
