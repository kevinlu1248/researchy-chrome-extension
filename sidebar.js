"use strict";

$(document).ready(() => {
	// TODO: make external page instead
	// chrome-extension://ehloondkpaeflbcliilagbjffflhfhag/html/sidebar.html
	$("html").prepend(`
		<button id="activateSidebarButton">
			&#9658;
		</button>
		<iframe id="researchySidePane"></iframe> 
	`);

	chrome.runtime.sendMessage(
		{ contentScriptQuery: "readFile", fileName: "html/sidebar.html" },
		(html) => {
			// console.log(html);
			var doc = $("#researchySidePane")[0].contentWindow.document;
			doc.open();
			doc.write(html);
			doc.close();
		}
	);

	// var doc = $("#researchySidePane")
	// 	.contents()
	// 	.find("head")
	// 	.html(SIDE_BAR_HEAD);

	// var doc = $("#researchySidePane")
	// 	.contents()
	// 	.find("body")
	// 	.html(SIDE_BAR_BODY);

	$("#activateSidebarButton").click(() => {
		console.log("clicked");
	});
});
