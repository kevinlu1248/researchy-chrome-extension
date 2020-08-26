"use strict";

const DEFAULT_STORAGE = {
	plugin_is_on: false,
	include_list: [],
};

chrome.runtime.onInstalled.addListener(function () {
	// add contents of files, bibliography
	// folder and files don't share names
	// no quotation marks
	chrome.storage.sync.get(null, (storage) => {
		console.log("Current storage: ", storage);
		let obj = {};
		Object.keys(DEFAULT_STORAGE).forEach((key) => {
			if (!storage[key]) {
				obj[key] = DEFAULT_STORAGE[key];
			}
		});
		chrome.storage.sync.set(obj);
	});
	chrome.identity.getAuthToken(null, (token, scopes) => {
		// console.log(token, scopes);
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
	let filePath = "FILE_" + request.contents.filePath;
	let partial = new Delta(request.contents.partial); // partial change
	chrome.storage.sync.get(filePath, (res) => {
		res[filePath] = res[filePath] || DEFAULT_FILE;
		let newStorage = {};
		newStorage[filePath] = res[filePath];
		newStorage[filePath].delta = new Delta(res[filePath].delta).compose(
			partial
		);
		console.log("new Storage: ", newStorage);
		chrome.storage.sync.set(newStorage);
	});
	queryAllTabs(request, [sender.tab.id]);
};

backgroundMessageHandler.activateSidebar = (request, sender, sendResponse) => {
	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
		console.log(tabs);
		chrome.tabs.sendMessage(tabs[0].id, {
			researchyAction: "activateSidebar",
		});
	});
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.info("Receiving request", request);
	let action = request.researchyAction;
	if (typeof backgroundMessageHandler[action] === "function") {
		let doAsync = backgroundMessageHandler.handleMessage(
			action,
			request,
			sender,
			sendResponse
		);
		if (doAsync === true) return true;
	}
});
