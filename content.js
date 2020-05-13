"use strict";

$ = jQuery;

const EXCLUDE = ['www.google.com']
const INCLUDE = ['www.ncbi.nlm.nih.gov',
'www.wikipedia.org', 'example.com']

var originalDoc = "<html>" + $("html").html() + "</html>";
var annotatedDoc = "";

$(document).ready(() => {

	var setDocToAnnotated = (toAnnotated) => {
		var newDocString = toAnnotated ? annotatedDoc : originalDoc;
		console.log(newDocString)
		var newDoc = document.open("text/html", "replace");
		newDoc.write(newDocString);
		newDoc.close();
	}

	var update = () => {
		chrome.storage.sync.get(['plugin_is_on'], (data) => {
			if (data.plugin_is_on) {
				setDocToAnnotated(true);
			}
		});
	}
	
	if (INCLUDE.includes(document.domain)) {
		var doc_html = "<html>" + $("html").html() + "</html>";
		console.log('sending message to background.js');
		chrome.runtime.sendMessage(
			{contentScriptQuery: "annotateText", text: doc_html, url: document.location},
			annotated => {
				console.log("responded");
				console.log(annotated[0]);
				if (annotated[1] == 'success') {
					var obj = annotated[0];
					var annotateDoc = obj["annotated_tree"];
					var domparser = new DOMParser();
					var annotatedDocDOM = domparser.parseFromString(annotateDoc, 'text/html');
					annotatedDocDOM.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', 
						`
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
						</style>`);
					annotatedDoc = annotatedDocDOM.documentElement.outerHTML
				}
				update();
			});
	}

	
});
