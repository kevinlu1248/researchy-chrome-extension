"use strict";

$ = jQuery;

// TODO: make seperate page and biological stuff optional
const IFRAME_HTML = `<iframe id="annotatedHTML" style="transform: 0.5s ease-in-out width, 0.5s ease-in-out margin-left;"></iframe>`;

const ORIGINAL_DOC = "<html>" + $("html").html() + "</html>";
var annotatedDoc = "";
var annotationIsCurrentlyOn = false;

$(document).ready(() => {
	var keyTerms = [];

	chrome.runtime.sendMessage({
		researchyAction: "pageCapture",
	});

	chrome.runtime.sendMessage(
		{
			researchyAction: "get",
			path: "Third/File 1",
		},
		console.log
	);

	chrome.runtime.sendMessage(
		{ researchyAction: "readFile", fileName: "html/reader.html" },
		(html) => {
			ANNOTATED_IFRAME.contents()
				.find("head")
				.html(
					html.replace(
						"{{modules/materialize/css/materialize.min.css}}",
						chrome.runtime.getURL(
							"modules/materialize/css/materialize.min.css"
						)
					)
				);
		}
	);
	chrome.runtime.sendMessage(
		{ researchyAction: "readFile", fileName: "html/spinner.html" },
		(html) => {
			ANNOTATED_IFRAME.contents().find("body").html(html);
		}
	);

	const BODY_CSS_DISPLAY = $("body").css("display");

	$("html").prepend(IFRAME_HTML);
	const ANNOTATED_IFRAME = $("iframe#annotatedHTML");
	console.log(ANNOTATED_IFRAME);

	var setDocToAnnotated = (toAnnotated) => {
		ANNOTATED_IFRAME.css("display", toAnnotated ? "inline-block" : "none");
		$("body").css("display", !toAnnotated ? BODY_CSS_DISPLAY : "none");
		if (toAnnotated) {
			window.scrollTo(0, 0);
		}
	};

	var updatePageMode = () => {
		chrome.storage.sync.get(["include_list", "plugin_is_on"], (res) => {
			var toAnnotated =
				res.include_list.includes(
					window.location.host + window.location.pathname
				) && res.plugin_is_on;
			console.log("setting to " + toAnnotated);
			setDocToAnnotated(toAnnotated);
		});
	};

	updatePageMode();

	chrome.runtime.onMessage.addListener((message, callback) => {
		// console.log(message);
		switch (message.researchyAction) {
			case "updatePageMode":
				updatePageMode();
				break;
		}
	});

	console.log(document.domain);
	console.log("sending message to background.js");
	chrome.runtime.sendMessage(
		{
			researchyAction: "annotateText",
			text: ORIGINAL_DOC,
			url: document.location,
		},
		(response) => {
			console.log("responded");
			console.log(response);
			if (response[1] == "success") {
				// initializing variables
				var obj = response[0];
				var annotateDoc = obj["annotated_tree"];
				var domparser = new DOMParser();
				var annotatedDocDOM = domparser.parseFromString(
					annotateDoc,
					"text/html"
				);
				var annotatedDocBody = annotatedDocDOM.getElementsByTagName(
					"body"
				)[0].innerHTML;
				keyTerms = obj.key_terms;
				console.log(keyTerms);

				// interpreting grade level
				var reading_level = "";
				if (30 < obj.reading_ease < 50) {
					reading_level = "College";
				} else if (30 > obj.reading_ease) {
					reading_level = "Graduate";
				} else {
					reading_level = `Grade ${Math.round(obj.grade_level)}`;
				}
				annotatedDocBody =
					`
						<div style="text-align: right;position: fixed;top: 1rem;right: 1rem;">
						Word count: ${obj.word_count} (${Math.round(
						obj.word_count / 250
					)} minute read)<br>
						${reading_level} level reading
						</div>
						` + annotatedDocBody;

				// updating string
				$("iframe#annotatedHTML")
					.contents()
					.find("body")
					.html(annotatedDocBody);
			}

			// For making reader mode more comprehensive
		}
	);
});
