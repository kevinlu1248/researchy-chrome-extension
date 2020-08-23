"use strict";
//fsMessageHandler.js

var fs;

SyncedFileSystem.fs.then((fs) => {
	window.fs = fs;
}, console.log);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var action = request.researchyAction;
	delete request.researchyAction;
	console.log(fs[action]);
	if (typeof fs[action] === "function") {
		// console.log(fs[action](...Object.values(request))
		sendResponse(fs[action](...Object.values(request)));
	}
	request.researchyAction = action;
});
