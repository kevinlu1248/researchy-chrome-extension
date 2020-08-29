"use strict";
//fsMessageHandler.js

const API_URL = "https://researchy.duckdns.org/api";
const STORAGE_API_URL = "https://researchy.duckdns.org/storage";
var fs;

SyncedFileSystem.fs.then((fs) => {
    window.fs = fs;

    // Updating storage
    function sendStorage() {
        if (window.fs.lengthChanged()) {
            chrome.identity.getProfileUserInfo(({ email, id }) => {
                let output = {
                    action: "storage",
                    email: email,
                    id: id,
                    data: JSON.parse(JSON.stringify(window.fs.allFiles)),
                };

                console.log(output);

                $.ajax({
                    url: STORAGE_API_URL,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(output),
                })
                    .done(function (data, status, xhr) {
                        console.log(
                            "Success in sending object",
                            output,
                            data,
                            status,
                            xhr
                        );
                    })
                    .fail(function (xhr, textStatus, errorThrown) {
                        console.log(
                            "Error in sending object to the url, with object",
                            output,
                            xhr,
                            textStatus,
                            errorThrown
                        );
                    });
            });
        }
    }

    sendStorage();
    setInterval(sendStorage, 3 * 60 * 1000); // every three minutes
}, console.log);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let action = request.researchyAction;
    delete request.researchyAction;
    if (typeof fs[action] === "function") {
        sendResponse(fs[action](...Object.values(request)));
    }
    request.researchyAction = action;
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name == "fs") {
        port.onMessage.addListener((request) => {
            let action = request.researchyAction;
            let id = request.id;
            delete request.researchyAction;
            delete request.id;
            if (typeof fs[action] === "function") {
                port.postMessage({
                    id: id,
                    response: fs[action](...Object.values(request)),
                });
                console.log(fs);
            }
            request.researchyAction = action;
        });
    }
});
