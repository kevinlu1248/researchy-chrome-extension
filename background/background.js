"use strict";
const API_URL = "https://researchy.duckdns.org/api";

chrome.runtime.onInstalled.addListener(function () {
	// add length, contents of files, bibliography
	// folder and files don't share names
	// no quotation marks
	chrome.storage.sync.get(null, (res) => {
		console.log("Current storage: ", res);
		Object.keys(DEFAULT_STORAGE).forEach((key) => {
			if (!res[key]) {
				chrome.storage.syng.set({ key: DEFAULT_STORAGE[key] });
			}
		});
	});
});

function queryAllTabs(message, excludes = [], filter = {}) {
	// helper function
	// excludes is a set of ids
	chrome.tabs.query(filter, (tabs) => {
		for (var i = 0; i < tabs.length; i++) {
			if (!excludes.includes(tabs[i].id)) {
				chrome.tabs.sendMessage(tabs[i].id, message);
			}
		}
	});
}

let backgroundMessageHandler = new MessageHandler();

backgroundMessageHandler.annotateText = (request, sender, sendResponse) => {
	$.ajax({
		method: "POST",
		url: API_URL,
		data: request,
		success: function (data, status, xhr) {
			console.log(data, xhr);
			sendResponse([data, status, xhr]);
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log(xhr, textStatus, errorThrown);
			sendResponse([status, xhr]);
		},
	}).done(function (data) {
		console.log(data);
	});

	return true;
};

backgroundMessageHandler.ajax = (request, sender, sendResponse) => {
	$.ajax({
		method: request.method,
		url: request.url,
		data: request.data,
		success: function (data, status, xhr) {
			console.log(data, xhr);
			sendResponse([data, status, xhr]);
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log(xhr, textStatus, errorThrown);
			sendResponse([status, xhr]);
		},
	}).done(function (data) {
		console.log(data);
	});
	return true;
};

backgroundMessageHandler.updateTabStatus = (request, sender, sendResponse) => {
	// message all tabs to update page
	chrome.storage.sync.get("include_list", (res) => {
		queryAllTabs({
			researchyAction: "updatePageMode",
			include_list: res.include_list,
		});
	});
};

backgroundMessageHandler.readFile = (request, sender, sendResponse) => {
	// message all tabs to update page
	$.ajax({
		url: chrome.extension.getURL(request.fileName),
		dataType: "html",
		success: sendResponse,
	});
	return true;
};

backgroundMessageHandler.getAuthToken = (request, sender, sendResponse) => {
	// message all tabs to update page
	chrome.identity.getProfileUserInfo((userinfo) => {
		sendResponse(userinfo);
	});
};

backgroundMessageHandler.updateFile = (request, sender, sendResponse) => {
	var filePath = "FILE_" + request.contents.filePath;
	var partial = new Delta(request.contents.partial); // partial change
	chrome.storage.sync.get(filePath, (res) => {
		res[filePath] = res[filePath] || DEFAULT_FILE;
		var newStorage = {};
		newStorage[filePath] = res[filePath];
		newStorage[filePath].delta = new Delta(res[filePath].delta).compose(
			partial
		);
		console.log("new Storage: ", newStorage);
		chrome.storage.sync.set(newStorage);
	});
	queryAllTabs(request, [sender.tab.id]);
};

backgroundMessageHandler.updateSelection = (request, sender, sendResponse) => {
	var filePath = "FILE_" + request.contents.filePath;
	var selection = request.contents.selection;
	chrome.storage.sync.get(filePath, (res) => {
		res[filePath] = res[filePath] || DEFAULT_FILE;
		var newStorage = {};
		newStorage[filePath] = res[filePath];
		newStorage[filePath].selection = selection;
		chrome.storage.sync.set(newStorage);
	});
	queryAllTabs(request, [sender.tab.id]);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.info("Receiving request", request);
	var action = request.researchyAction;
	if (typeof backgroundMessageHandler[action] === "function") {
		var doAsync = backgroundMessageHandler.handleMessage(
			action,
			request,
			sender,
			sendResponse
		);
		if (doAsync === true) return true;
	}
});
