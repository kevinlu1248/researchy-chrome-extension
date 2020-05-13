"use strict";

// Special thanks to FA for the two icons

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({plugin_is_on: false});
});

chrome.browserAction.onClicked.addListener((tab) => {
	chrome.storage.sync.get(['plugin_is_on'], function(data) {
		// alert(data.plugin_is_on)
		if (data.plugin_is_on === true) {
			chrome.storage.sync.set({plugin_is_on: false});
			chrome.browserAction.setIcon({path: {'16': 'icons/off.png'}});
		} else {
			chrome.storage.sync.set({plugin_is_on: true});
			chrome.browserAction.setIcon({path: {'16': 'icons/on.png'}});
		}
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("sending request");
		if (request.contentScriptQuery == 'annotateText') {
			$.ajax({
				method: "POST",
				url: 'http://157.245.229.128:5001/',
				data: JSON.stringify(request), 
				contentType: "application/json; charset=UTF-8",
				success: function(data, status, xhr) {
					console.log(data);
					console.log(xhr);
					sendResponse([data, status, xhr]);
				},
				error: function(xhr, textStatus, errorThrown) {
					console.log(xhr);
					console.log(textStatus);
					console.log(errorThrown);
					sendResponse([data, status, xhr]);
				}
			}).done(function(data) {
				console.log(data);
			});

			return true;
		}
	});
