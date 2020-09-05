"use strict";

// files stored as FILE_{filename}
// TODO: open and close from popup

var Delta = Quill.import("delta");

$("html").prepend(
    `<iframe id="researchySidebar" src="${chrome.runtime.getURL(
        "/static/html/sidebar.html"
    )}"></iframe>`
);

const sidebarWindow = document.getElementById("researchySidebar").contentWindow;

if (window.location.href == "https://this-page-intentionally-left-blank.org/")
    $("#researchySidebar, #annotatedHTML, body").addClass("sidebarActive");

chrome.runtime.onMessage.addListener((message, callback) => {
    // console.log(message);
    switch (message.researchyAction) {
        case "activateSidebar":
            $("#researchySidebar, #annotatedHTML, body").addClass(
                "sidebarActive"
            );
            sidebarWindow.postMessage({
                researchyAction: "sidebarActivated"
            });
    }
});
