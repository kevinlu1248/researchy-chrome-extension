"use strict";

$ = jQuery;

const EXCLUDE = ["www.google.com"];
const INCLUDE = ["www.ncbi.nlm.nih.gov", "www.wikipedia.org", "example.com"];
const READER_CSS = `
<link href="https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
	html {
		font-family: 'Literata', serif;
		display: flex;
		line-height: 1.75;
		padding: 2rem;
	}

	body {
		max-width: 800px;
		margin: auto;
		text-align: justify;
	}

	title {
		text-align: left;
	}

	p, annotated, li {
		font-size: 20px;
	}

	gpe, cardinal, percentage, org {
		background-color: pink;
	}

	cancer, organ, cell, tissue, gene_or_gene_product, simple_chemical, immaterial_anatomical_entity {
	            background-color: aquamarine;
	        }

	term {
		font-weight: bold;
	}
</style>
`;

var originalDoc = "<html>" + $("html").html() + "</html>";
var annotatedDoc = "";
var annotationIsCurrentlyOn = false;

$(document).ready(() => {
	const DOC_HTML = "<html>" + $("html").html() + "</html>";
	const BODY_CSS_DISPLAY = $("body").css("display");

	$("html").prepend(
		`<iframe id="annotatedHTML" style="transform: 0.5s ease-in-out width, 0.5s ease-in-out margin-left;"></iframe>`
	);
	const ANNOTATED_IFRAME = $("iframe#annotatedHTML");
	ANNOTATED_IFRAME.contents().find("head").html(READER_CSS);
	ANNOTATED_IFRAME.contents().find("body").html("Loading...");

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
		console.log(message);
		switch (message.action) {
			case "updatePageMode":
				updatePageMode();
				break;
		}
	});

	console.log(document.domain);
	console.log("sending message to background.js");
	chrome.runtime.sendMessage(
		{
			contentScriptQuery: "annotateText",
			text: DOC_HTML,
			url: document.location,
		},
		(annotated) => {
			console.log("responded");
			console.log(annotated);
			if (annotated[1] == "success") {
				console.log("Success!");

				// initializing variables
				var obj = annotated[0];
				var annotateDoc = obj["annotated_tree"];
				var domparser = new DOMParser();
				var annotatedDocDOM = domparser.parseFromString(
					annotateDoc,
					"text/html"
				);
				var annotatedDocBody = annotatedDocDOM.getElementsByTagName(
					"body"
				)[0].innerHTML;

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
