"use strict";
const API_URL = "http://64.225.115.179/api";

chrome.runtime.onInstalled.addListener(function () {
	// add length, contents of files, bibliography
	// folder and files don't share names
	// no quotation marks
	chrome.storage.sync.set({
		plugin_is_on: false,
		include_list: [],
		fileSystem: [
			{
				type: "folder",
				name: "First",
				contents: [
					{
						type: "folder",
						name: "Second",
						contents: [{ type: "rtf", name: "File 1" }],
					},
					{
						type: "folder",
						name: "Third",
						contents: [{ type: "rtf", name: "File 1" }],
					},
				],
			},
			{
				type: "folder",
				name: "Second",
				contents: [
					{ type: "rtf", name: "File 1" },
					{
						type: "folder",
						name: "Third",
						contents: [{ type: "rtf", name: "File 1" }],
					},
				],
			},
			{
				type: "folder",
				name: "Third",
				contents: [{ type: "rtf", name: "File 1" }],
			},
		],
		activeFilePath: "Third/File 1",
	});
	function displayPath(fileEntry) {
		chrome.fileSystem.getDisplayPath(fileEntry, function (path) {
			console.log(path);
		});
	}
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
	} else if (request.contentScriptQuery == "getAuthToken") {
		// chrome.identity.getAuthToken((token, scopes) => {
		// 	sendResponse(token, scopes);
		// });
		chrome.identity.getProfileUserInfo((userinfo) => {
			sendResponse(userinfo);
		});
		return true;
	}
});
