"use strict";

// files stored as FILE_{filename}

var Delta = Quill.import("delta");
const DEFAULT_FILE = {
	ops: [
		{ insert: "Title" },
		{ attributes: { header: 1 }, insert: "\n" },
		{ insert: "Pursue your scholarly desires..." },
	],
};
const DEFAULT_SELECTION = {
	index: 0,
	length: 0,
};

function getContentsFromFilePath(filePath, fileStructure) {
	// uses filepath to find content of that structure within currentFileStructure
	// TODO: Add error management
	var currentFolder = currentFileStructure;
	var expandedPath = filePath.split("/");
	expandedPath.forEach((entityName, index) => {
		console.log(currentFolder, entityName);
		for (var i = 0; i < currentFolder.length; i++) {
			if (currentFolder[i].name == entityName) {
				currentFolder =
					index == expandedPath.length - 1
						? currentFolder[i]
						: currentFolder[i].contents;
				break;
			}
		}
	});
	return currentFolder;
}

$(document).ready(() => {
	// TODO: make external page instead
	// chrome-extension://ehloondkpaeflbcliilagbjffflhfhag/html/sidebar.html
	$("html").prepend(`
		<button id="activateSidebarButton">
			&#9658;
		</button>
		<iframe id="researchySidebar"></iframe>
	`);

	const sidebarWindow = document.getElementById("researchySidebar")
		.contentWindow;

	chrome.runtime.sendMessage(
		{ researchyAction: "readFile", fileName: "html/sidebar.html" },
		(html) => {
			var doc = sidebarWindow.document;
			doc.open();
			doc.write(html);
			doc.close();
		}
	);

	$("#activateSidebarButton").click(() => {
		$("#researchySidebar, #annotatedHTML, body").addClass("sidebarActive");
		sidebarWindow.postMessage({
			researchyAction: "sidebarActivated",
		});
	});

	chrome.runtime.onMessage.addListener((message, callback) => {
		switch (message.researchyAction) {
			case "updateFile":
				sidebarWindow.postMessage(message);
				break;
			case "updateSelection":
				sidebarWindow.postMessage(message);
				break;
		}
	});

	window.addEventListener("message", function (event) {
		if (
			!["updateFile", "updateSelection"].includes(
				event.data.researchyAction
			)
		) {
			// too frequent, less logging
			console.log("Received message ", event.data);
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
				chrome.storage.sync.get(null, (res) => {
					sidebarWindow.postMessage({
						researchyAction: "refreshFiles",
						storage: res,
					});
				});
				break;
			case "updateFile":
				chrome.runtime.sendMessage(event.data);
				break;
			case "updateSelection":
				chrome.runtime.sendMessage(event.data);
				break;
			case "switchFile":
				var filePath = "FILE_" + event.data.filePath;
				chrome.storage.sync.get(filePath, (res) => {
					res[filePath].contents =
						res[filePath].contents || DEFAULT_FILE;
					res[filePath].selection = res[filePath].selection || {
						index: 0,
						length: 0,
					};
					sidebarWindow.postMessage({
						researchyAction: "switchFile",
						filePath: event.data.filePath,
						fileContents: res[filePath] || defaultContents,
					});
				});
				chrome.storage.sync.set("activeFilePath", filePath);
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
});