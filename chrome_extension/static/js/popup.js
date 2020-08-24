"use strict";

// Initiate links
document.addEventListener("DOMContentLoaded", () => {
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		links[i].addEventListener("click", (event) => {
			var path = event.path;
			for (var j = 0; j < path.length; j++) {
				if (path[j] instanceof HTMLAnchorElement) {
					chrome.tabs.create({ url: path[j].href });
					break;
				}
			}
		});
	}

	// initiate notes opener
	document.getElementById("activateSidebar").addEventListener("click", () => {
		chrome.runtime.sendMessage({ researchyAction: "activateSidebar" });
		window.close();
	});
});

// Message background.js regarding changes
var updateBackgroundTabStatus = () => {
	console.log("sending message");
	chrome.runtime.sendMessage({ researchyAction: "updateTabStatus" });
};

// Power button information --------------------------------------------------------------
const powerCheck = document.getElementById("powerCheck");

var updatePowerSettings = (doSetToOn, callBack = () => {}) => {
	// Updates power setting in storage to doSetTo
	chrome.storage.sync.set({ plugin_is_on: doSetToOn }, callBack);
};

chrome.storage.sync.get("plugin_is_on", (res) => {
	powerCheck.checked = res.plugin_is_on;
}); // sets the button to color according to storage

powerCheck.addEventListener("click", () => {
	// Turns button off and settings to off on click
	var doSetToOn = powerCheck.checked;
	updatePowerSettings(doSetToOn, updateBackgroundTabStatus);
});

// Annotate button ------------------------------------------------------------------------
// const annotateButton = document.getElementById("annotate-button");
const annotateCheck = document.getElementById("annotateCheck");
var urlName;

var updateAnnotateInclude = (newUrl, doInclude, callBack = () => {}) => {
	chrome.storage.sync.get("include_list", (res) => {
		var newList = res.include_list;
		const index = newList.indexOf(newUrl);
		if (index == -1 && doInclude) {
			// not in the document already but we want to add it
			chrome.storage.sync.set(
				{
					include_list: res.include_list.concat(newUrl),
				},
				callBack
			);
		} else if (index > -1 && !doInclude) {
			// if not doInclude, find and delete newUrl
			newList.splice(index, 1);
			chrome.storage.sync.set(
				{
					include_list: newList,
				},
				callBack
			);
		}
	});
};

var updateAnnotateColor = (doSetToOn) => {
	// update annotate button color to match doSetToOn
	annotateCheck.checked = doSetToOn;
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	var url = new URL(tabs[0].url);
	urlName = url.host + url.pathname; // eg.google.com/search;
	console.log(url.host + url.pathname);
	chrome.storage.sync.get("include_list", (res) => {
		var doSetToOn = res.include_list.includes(urlName);
		updateAnnotateColor(doSetToOn);
		console.log(doSetToOn);
	});
});

annotateCheck.addEventListener("click", () => {
	var doSetToOn = annotateCheck.checked;
	updateAnnotateInclude(urlName, doSetToOn, updateBackgroundTabStatus);
	chrome.storage.sync.get("include_list", (res) => {
		console.log(res.include_list);
	});
	// TODO: Add load button
});
