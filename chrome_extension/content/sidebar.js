"use strict";

// files stored as FILE_{filename}
// TODO: open and close from popup

var Delta = Quill.import("delta");

// TODO: make external page instead
// chrome-extension://ehloondkpaeflbcliilagbjffflhfhag/html/sidebar.html
console.log(window.location.href);
$("html").prepend(`<iframe id="researchySidebar"></iframe>`);

const sidebarWindow = document.getElementById("researchySidebar").contentWindow;

chrome.runtime.sendMessage(
	{ researchyAction: "readFile", fileName: "static/html/sidebar.html" },
	(html) => {
		var doc = sidebarWindow.document;
		doc.open();
		doc.write(replaceURLs(html));
		doc.close();
	}
);

chrome.runtime.onMessage.addListener((message, callback) => {
	console.log(message);
	switch (message.researchyAction) {
		case "updateFile":
			sidebarWindow.postMessage(message);
			break;
		case "updateSelection":
			sidebarWindow.postMessage(message);
			break;
		case "activateSidebar":
			$("#researchySidebar, #annotatedHTML, body").addClass(
				"sidebarActive"
			);
			sidebarWindow.postMessage({
				researchyAction: "sidebarActivated",
			});
	}
});

const fsport = chrome.runtime.connect({ name: "fs" });

window.addEventListener("message", (event) => {
	if (
		!["updateFile", "updateSelection"].includes(event.data.researchyAction)
	) {
		// too frequent, less logging
		console.log("Received message ", event.data);
	}

	if (event.data.receiver == "fs") {
		let id = event.data.id;
		delete event.data.receiver;
		if (id != undefined) {
			delete event.data.id;
			fsport.postMessage(event.data);
			chrome.runtime.sendMessage(event.data, (...response) => {
				sidebarWindow.postMessage({ id: id, response: response });
			});
			fsport.onMessage.addListener((response) => {
				sidebarWindow.postMessage({ id: id, response: response });
			});
		} else {
			fsport.postMessage(event.data);
		}
		return;
	}

	switch (event.data.researchyAction) {
		case "deactivateSidebarButton":
			$("#researchySidebar, #annotatedHTML, body").removeClass(
				"sidebarActive"
			);
			break;
		case "activateFileSystem":
			$("#researchySidebar")
				.contents()
				.find("#fileSystemMenu")
				.addClass("fileSystemActive");
			break;
		case "deactivateFileSystem":
			$("#researchySidebar")
				.contents()
				.find("#fileSystemMenu")
				.removeClass("fileSystemActive");
			break;
		case "getFiles":
			chrome.runtime.sendMessage(
				{
					researchyAction: "json",
				},
				(storage) =>
					sidebarWindow.postMessage({
						researchyAction: "refreshFiles",
						storage: storage,
					})
			);
			break;
		case "updateFile":
			console.log(event.data);
			chrome.runtime.sendMessage(event.data);
			break;
		case "updateSelection":
			console.log(event.data);
			chrome.runtime.sendMessage(event.data);
			break;
		case "switchFile":
			chrome.runtime.sendMessage(
				{
					researchyAction: "get",
					path: event.data.filePath,
				},
				(file) => {
					console.log(file);
					sidebarWindow.postMessage({
						researchyAction: "switchFile",
						file: file,
					});
				}
			);
			chrome.runtime.sendMessage(event.data);
			break;
		case "newFile":
			break;
		case "newFolder":
			break;
		case "renameFile":
			break;
		case "renameFolder":
			break;
		case "deleteFile":
			break;
		case "deleteFolder":
			break;
	}
});
