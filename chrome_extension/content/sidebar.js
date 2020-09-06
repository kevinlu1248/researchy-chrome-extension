"use strict";

// files stored as FILE_{filename}
// TODO: open and close from popup

var Delta = Quill.import("delta");

$("html").prepend(
    `<iframe id="researchySidebar" src="${chrome.runtime.getURL(
        "/sidebar/index.html"
    )}"></iframe>`
);

const sidebarWindow = document.getElementById("researchySidebar").contentWindow;

if (window.location.href == "https://this-page-intentionally-left-blank.org/")
    $("#researchySidebar, #annotatedHTML, body").addClass("sidebarIsOpen");

chrome.runtime.onMessage.addListener((message, callback) => {
    // console.log(message);
    switch (message.researchyAction) {
        case "openSidebar":
            $("#researchySidebar, #annotatedHTML, body").addClass(
                "sidebarIsOpen"
            );
            break;
        case "closeSidebar":
            $("#researchySidebar, #annotatedHTML, body").removeClass(
                "sidebarIsOpen"
            );
            break;
    }
});
