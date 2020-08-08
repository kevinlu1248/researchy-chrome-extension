"use strict";

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
		}
	});
});
