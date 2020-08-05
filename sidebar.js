"use strict";

$(document).ready(() => {
	// TODO: make external page instead
	// chrome-extension://ehloondkpaeflbcliilagbjffflhfhag/html/sidebar.html
	$("html").prepend(`
		<button id="activateSidebarButton">
			&#9658;
		</button>
		<iframe id="researchySidebar"></iframe> 
		<button id="deactivateSidebarButton">
			&#9668;
		</button>
	`);

	chrome.runtime.sendMessage(
		{ contentScriptQuery: "readFile", fileName: "html/sidebar.html" },
		(html) => {
			// console.log(html);
			var doc = $("#researchySidebar")[0].contentWindow.document;
			doc.open();
			doc.write(html);
			doc.close();
		}
	);

	$("#activateSidebarButton").click(() => {
		$("#researchySidebar, #annotatedHTML").addClass("sidebarActive");
	});

	// console.log($("#researchySidebar").contents("#deactivateSidebarButton"));
	// $("#researchySidebar")
	// 	.contents("#deactivateSidebarButton")
	// 	.click(() => {
	// 		$("#researchySidebar, #annotatedHTML").removeClass("sidebarActive");
	// 	});

	window.addEventListener("message", function (event) {
		console.log("Received message ", event.data);
		switch (event.data.researchyAction) {
			case "deactivateSidebarButton":
				$("#researchySidebar, #annotatedHTML").removeClass(
					"sidebarActive"
				);
				break;
		}
	});
});
