"use strict";
//fsMessageHandler.js

var fs;

SyncedFileSystem.fs.then((fs) => {
	window.fs = fs;
}, console.log);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	let action = request.researchyAction;
	delete request.researchyAction;
	if (typeof fs[action] === "function") {
		sendResponse(fs[action](...Object.values(request)));
		console.log(fs);
	}
	request.researchyAction = action;
});

chrome.runtime.onConnect.addListener((port) => {
	if (port.name == "fs") {
		port.onMessage.addListener((request) => {
			let action = request.researchyAction;
			delete request.researchyAction;
			if (typeof fs[action] === "function") {
				port.postMessage(fs[action](...Object.values(request)));
				console.log(fs);
			}
			request.researchyAction = action;
		});
	}
});
