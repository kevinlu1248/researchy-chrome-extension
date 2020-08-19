"use strict";
//fsMessageHandler.js

var fs;

FileSystem.fs.then((fs) => {
	window.fs = fs;
}, console.log);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var action = request.researchyAction;
	delete request.researchyAction;
	if (typeof fs[action] === "function") {
		sendResponse(fs[action](...Object.values(request)));
	}
	request.researchyAction = action;
});
