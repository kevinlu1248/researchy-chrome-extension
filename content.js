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

    $("html").prepend(
        `<iframe id="annotatedHTML" style="width: 100vw; height: 100vh; display: none; background-color: white;"></iframe>`
    );
    const ANNOTATED_IFRAME = $("iframe#annotatedHTML");
    ANNOTATED_IFRAME.contents().find("head").html(READER_CSS);
    ANNOTATED_IFRAME.contents().find("body").html("Loading...");

    var setDocToAnnotated = (toAnnotated) => {
        ANNOTATED_IFRAME.css("display", toAnnotated ? "inline-block" : "none");
    };

    var updatePageMode = () => {
        chrome.storage.sync.get(["plugin_is_on"], (data) => {
            console.log("Updating: setting plugin to " + data.plugin_is_on);
            setDocToAnnotated(data.plugin_is_on);
        });
    };

    chrome.runtime.onMessage.addListener((message, callback) => {
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
            if (annotated[1] == "success") {
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
            updatePageMode();
        }
    );
    // }
});
