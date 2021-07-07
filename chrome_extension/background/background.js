"use strict";

const DEFAULT_STORAGE = {
    plugin_is_on: false,
    sidebarIsOpen: false,
    include_list: []
};

chrome.runtime.onInstalled.addListener(function () {
    // add contents of files, bibliography
    // folder and files don't share names
    // no quotation marks
    chrome.storage.sync.get(null, (storage) => {
        console.log("Current storage: ", storage);
        let obj = {};
        Object.keys(DEFAULT_STORAGE).forEach((key) => {
            if (!storage[key]) {
                obj[key] = DEFAULT_STORAGE[key];
            }
        });
        chrome.storage.sync.set(obj);
    });
});

function queryAllTabs(message, excludes = [], filter = {}) {
    // helper function
    // excludes is a set of ids
    chrome.tabs.query(filter, (tabs) => {
        for (var i = 0; i < tabs.length; i++) {
            if (!excludes.includes(tabs[i].id)) {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
        }
    });
}

let backgroundMessageHandler = new MessageHandler();

backgroundMessageHandler.annotateText = (request, sender, sendResponse) => {
    $.ajax({
        method: "POST",
        url: API_URL,
        data: request,
        success: function (data, status, xhr) {
            console.log(data, xhr);
            sendResponse([data, status, xhr]);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr, textStatus, errorThrown);
            sendResponse([status, xhr]);
        }
    });
    return true;
};

backgroundMessageHandler.ajax = (request, sender, sendResponse) => {
    $.ajax({
        method: request.method,
        url: request.url,
        data: request.data,
        success: function (data, status, xhr) {
            console.log(data, xhr);
            sendResponse([data, status, xhr]);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr, textStatus, errorThrown);
            sendResponse([status, xhr]);
        }
    });
    return true;
};

backgroundMessageHandler.updateTabStatus = (request, sender, sendResponse) => {
    // message all tabs to update page
    chrome.storage.sync.get("include_list", (res) => {
        queryAllTabs({
            researchyAction: "updatePageMode",
            include_list: res.include_list
        });
    });
};

backgroundMessageHandler.readFile = (request, sender, sendResponse) => {
    // message all tabs to update page
    $.ajax({
        url: chrome.extension.getURL(request.fileName),
        dataType: "html",
        success: sendResponse
    });
    return true;
};

backgroundMessageHandler.toggleSidebar = (request, sender, sendResponse) => {};

backgroundMessageHandler.activateSidebar = (request, sender, sendResponse) => {
    chrome.storage.sync.set({ sidebarIsOpen: true }, () =>
        chrome.storage.sync.get("sidebarIsOpen", console.log)
    );
    queryAllTabs({ researchyAction: "openSidebar" });
};

backgroundMessageHandler.closeSidebar = (request, sender, sendResponse) => {
    chrome.storage.sync.set({ sidebarIsOpen: false });
    queryAllTabs({ researchyAction: "closeSidebar" });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.info("Receiving request", request);
    let action = request.researchyAction;
    if (typeof backgroundMessageHandler[action] === "function") {
        let doAsync = backgroundMessageHandler.handleMessage(
            action,
            request,
            sender,
            sendResponse
        );
        if (doAsync === true) return true;
    }
});
