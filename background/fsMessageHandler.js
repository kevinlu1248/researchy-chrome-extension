"use strict";
//fsMessageHandler.js
// maybe make asynchronous

var fs;
const fsMessageHandler = new MessageHandler();

FileSystem.fs.then((fs) => {
	window.fs = fs;
}, console.log);

// fsMessageHandler.get = (request, sender, sendResponse) => {
// 	return fs.get(request.path);
// };

// fsMessageHandler.set = (request, sender, sendResponse) => {
// 	return fs.set(request.path, request.newItem);
// };

// fsMessageHandler.rename = (request, sender, sendResponse) => {
// 	return fs.rename(request.path, request.name);
// };

// fsMessageHandler.newFile;
// fsMessageHandler.newFolder;
// fsMessageHandler.update;
// fsMessageHandler.delete;

// fsMessageHandler.log = (request, sender, sendResponse) => {
// 	// for debugging
// 	console.log(fs);
// };

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// return fsMessageHandler.handleMessage(
	// 	request.researchyAction,
	// 	request,
	// 	sender,
	// 	sendResponse
	// );

	var action = request.researchyAction;
	delete request.researchyAction;
	if (fs[action]) {
		console.log(fs[action](...Object.values(request)));
		return fs[action](...Object.values(request));
	}
});
