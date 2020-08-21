"use strict";
function replaceURLs(doc) {
	return doc.replace(/\{\{([\.\/a-zA-Z]+)\}\}/g, (match, p) => {
		return chrome.runtime.getURL(p);
	});
}
