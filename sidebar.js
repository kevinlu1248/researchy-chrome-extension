"use strict";
var Delta = Quill.import("delta");
const DEFAULT_FILE = {
	ops: [
		{ insert: "Title" },
		{ attributes: { header: 1 }, insert: "\n" },
		{ insert: "Pursue your scholarly desires..." },
	],
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

	chrome.runtime.sendMessage(
		{ contentScriptQuery: "readFile", fileName: "html/sidebar.html" },
		(html) => {
			var doc = $("#researchySidebar")[0].contentWindow.document;
			doc.open();
			doc.write(html);
			doc.close();
		}
	);

	$("#activateSidebarButton").click(() => {
		$("#researchySidebar, #annotatedHTML, body").addClass("sidebarActive");
		document.getElementById("researchySidebar").contentWindow.postMessage({
			researchyAction: "sidebarActivated",
		});
	});

	window.addEventListener("message", function (event) {
		console.log("Received message ", event.data);
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
			case "getFileStructure":
				chrome.storage.sync.get(
					["fileSystem", "activeFilePath"],
					(res) => {
						document
							.getElementById("researchySidebar")
							.contentWindow.postMessage({
								researchyAction: "refreshFileStructure",
								fileSystem: res.fileSystem,
								activeFilePath: res.activeFilePath,
							});
					}
				);
				break;
			case "updateFile":
				var filePath = event.data.contents.filePath;
				var partial = new Delta(event.data.contents.partial); // partial change
				chrome.storage.sync.get("fileSystem", () => {});
				break;
		}
	});
});
