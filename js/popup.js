"use strict";

// Message background.js regarding changes
var updateBackgroundUpdateTabStatus = () => {
	chrome.runtime.sendMessage("updateTabStatus");
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
const annotateButton = document.getElementById("annotate-button"); //
var urlName = document.location.host + document.location.pathname; // eg. google.com/search
var updateAnnotateInclude = (newUrl, doInclude) => {
	chrome.storage.sync.get("include_list", (res) => {
		if (doInclude) {
			chrome.storage.sync.set({
				include_list: res.include_list.concat(newUrl),
			});
		} else {
			// if not doInclude, find and delete newUrl
			var newList = res.include_list;
			const index = newList.indexOf(newUrl);
			if (index > -1) {
				newList.splice(index, 1);
			}
			chrome.storage.sync.set({
				include_list: newList,
			});
		}
	});
};
var updateAnnotateColor = (doSetToOn) => {
	// update annotate button color to match doSetToOn
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
	var output = false;
	chrome.storage.sync.get("include_list", (res) => {
		output = res.include_list.includes(urlName);
	});
	return output;
};
updateAnnotateColor(getDoAnnotateFromStorage());
annotateButton.addEventListener("click", () => {
	var doSetToOn = annotateButton.classList.contains("grey");
	updateAnnotateColor(doSetToOn);
	updateAnnotateInclude(urlName, doSetToOn);
	// chrome.storage.sync.get("include_list", (res) => {
	// 	console.log(res.include_list);
	// });
	updateBackgroundUpdateTabStatus;
});
