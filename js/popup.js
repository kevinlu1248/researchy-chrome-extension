"use strict";

// Message background.js regarding changes
var updateBackgroundUpdateTabStatus = () => {
	console.log("sending message");
	chrome.runtime.sendMessage({ contentScriptQuery: "updateTabStatus" });
};

// Power button information --------------------------------------------------------------
const powerButton = document.getElementById("power-button");

var updatePowerSettings = (doSetToOn) => {
	// Updates power setting in storage to doSetTo
	chrome.storage.sync.set({ plugin_is_on: doSetToOn });
};

var updatePowerColor = (doSetToOn) => {
	// set button to on if doSetToOn
	if (doSetToOn) {
		powerButton.classList.add("light-blue-text");
		powerButton.classList.remove("grey-text");
	} else {
		powerButton.classList.add("grey-text");
		powerButton.classList.remove("light-blue-text");
	}
};

chrome.storage.sync.get("plugin_is_on", (res) => {
	updatePowerColor(res.plugin_is_on);
}); // sets the button to color according to storage

powerButton.addEventListener("click", () => {
	// Turns button off and settings to off on click
	var doSetToOn = !powerButton.classList.contains("light-blue-text");
	updatePowerColor(doSetToOn);
	updatePowerSettings(doSetToOn);
	updateBackgroundUpdateTabStatus();
});

// Annotate button ------------------------------------------------------------------------
const annotateButton = document.getElementById("annotate-button");
var urlName;

var updateAnnotateInclude = (newUrl, doInclude) => {
	chrome.storage.sync.get("include_list", (res) => {
		var newList = res.include_list;
		const index = newList.indexOf(newUrl);
		if (index == -1 && doInclude) {
			// not in the document already but we want to add it
			chrome.storage.sync.set({
				include_list: res.include_list.concat(newUrl),
			});
		} else if (index > -1 && !doInclude) {
			// if not doInclude, find and delete newUrl
			newList.splice(index, 1);
			chrome.storage.sync.set({
				include_list: newList,
			});
		}
	});
};

var updateAnnotateColor = (doSetToOn) => {
	// update annotate button color to match doSetToOn
	console.log(doSetToOn);
	if (doSetToOn) {
		annotateButton.classList.add("light-blue");
		annotateButton.classList.remove("grey");
	} else {
		annotateButton.classList.add("grey");
		annotateButton.classList.remove("light-blue");
	}
};

var getDoAnnotateFromStorage = () => {
	// get if the url is in the link
	var output;
	chrome.storage.sync.get("include_list", (res) => {
		console.log(urlName, res.include_list);
		output = res.include_list.includes(urlName);
	});
	return output;
};

chrome.tabs.query({ active: true }, (tabs) => {
	var url = new URL(tabs[0].url);
	urlName = url.host + url.pathname; // eg.google.com/search;
	console.log(url.host + url.pathname);
	chrome.storage.sync.get("include_list", (res) => {
		var doSetToOn = res.include_list.includes(urlName);
		updateAnnotateColor(doSetToOn);
	});
});

annotateButton.addEventListener("click", () => {
	var doSetToOn = annotateButton.classList.contains("grey");
	updateAnnotateColor(doSetToOn);
	updateAnnotateInclude(urlName, doSetToOn);
	chrome.storage.sync.get("include_list", (res) => {
		console.log(res.include_list);
	});
	updateBackgroundUpdateTabStatus();
});
