"use strict";
function replaceURLs(doc) {
	return doc.replace(/\{\{([\.\/a-zA-Z]+)\}\}/g, (match, p) => {
		return chrome.runtime.getURL(p);
	});
}

function VanillaMessageHandler() {
	const obj = {};
	obj.handleMessage = function (event) {
		if (typeof obj[event.data.researchyAction] === "function") {
			obj[event.data.researchyAction](event.data);
		}
	};
	return obj;
}
