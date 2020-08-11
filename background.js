"use strict";
var Delta = Quill.import("delta");

const API_URL = "http://64.225.115.179/api";

const DEFAULT_FILES = [
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
];

const DEFAULT_FILE = {
	contents: {
		ops: [
			{ insert: "Title" },
			{ attributes: { header: 1 }, insert: "\n" },
			{ insert: "Pursue your scholarly desires..." },
		],
	},
	selection: 0,
};

const DEFAULT_STORAGE = {
	activeFilePath: "Third/File 1",
	"FILE_Third/File 1": DEFAULT_FILE,
	fileSystem: DEFAULT_FILES,
};

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("receiving request with request", request);
	if (request.researchyAction == "annotateText") {
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
				sendResponse(["", status, xhr]);
			},
		}).done(function (data) {
			console.log(data);
		});

		return true;
	} else if (request.researchyAction == "updateTabStatus") {
		// message all tabs to update page
		chrome.storage.sync.get("include_list", (res) => {
			queryAllTabs({
				researchyAction: "updatePageMode",
				include_list: res.include_list,
			});
		});
	} else if (request.researchyAction == "readFile") {
		$.ajax({
			url: chrome.extension.getURL(request.fileName),
			dataType: "html",
			success: sendResponse,
		});
		return true;
	} else if (request.researchyAction == "getAuthToken") {
		// chrome.identity.getAuthToken((token, scopes) => {
		// 	sendResponse(token, scopes);
		// });
		chrome.identity.getProfileUserInfo((userinfo) => {
			sendResponse(userinfo);
		});
		return true;
	} else if (request.researchyAction == "updateFile") {
		var filePath = "FILE_" + request.contents.filePath;
		var partial = new Delta(request.contents.partial); // partial change
		chrome.storage.sync.get(filePath, (res) => {
			res[filePath] = res[filePath] || DEFAULT_FILE;
			var newStorage = {};
			newStorage[filePath] = res[filePath];
			newStorage[filePath].contents = new Delta(
				res[filePath].contents
			).compose(partial);
			console.log("new Storage: ", newStorage);
			chrome.storage.sync.set(newStorage);
		});
		queryAllTabs(request, [sender.tab.id]);
	} else if (request.researchyAction == "updateSelection") {
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
	}
});
