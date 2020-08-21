document.getElementById("deactivateSidebarButton").onclick = () => {
    parent.postMessage({
        researchyAction: "deactivateSidebarButton",
    });
};

document.getElementById("activateFileSystem").onclick = () => {
    parent.postMessage({
        researchyAction: "activateFileSystem",
    });
};

document.getElementById("deactivateFileSystem").onclick = () => {
    parent.postMessage({
        researchyAction: "deactivateFileSystem",
    });
};

var activeFile,
    activeFileName,
    activeFilePath,
    activeFileContents,
    currentFileStructure;

var Delta = Quill.import("delta");
var quill = new Quill("#editor", {
    modules: {
        toolbar: [
            [{ header: 1 }, { header: 2 }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block", "formula"],
            ["link", "image", "video"],
            [{ color: [] }, { background: [] }],
        ],
    },
    scrollingContainers: {
        "overflow-y": "auto",
    },
    theme: "snow",
});

function getContentsFromFilePath(
    filePath,
    fileStructure = currentFileStructure
) {
    // uses filepath to find content of that structure within currentFileStructure
    // TODO: Add error management
    var currentFolder = currentFileStructure;
    var expandedPath = filePath.split("/");
    expandedPath.forEach((entityName, index) => {
        console.log(currentFolder, entityName);
        for (var i = 0; i < currentFolder.length; i++) {
            if (currentFolder[i].name == entityName) {
                currentFolder =
                    index == expandedPath.length - 1
                        ? currentFolder[i]
                        : currentFolder[i].delta;
                break;
            }
        }
    });
    return currentFolder;
}

function filesToHtml(fileStructure, filePath = "") {
    // recursively generate a doc
    console.log(fileStructure);
    var html = `<ul class="${
        !filePath ? "" : "collapsible-body " // check if initial
    }collapsible expandable">`;
    fileStructure.forEach((e) => {
        if (e.type == "rtf") {
            html = html.concat(`
                <li class="fileItem waves-effect waves-blue btn-flat" file_path="${
                    filePath + e.name
                }">
                    ${e.name}
                    <span>
                        <a class="waves-effect waves-blue btn-flat">
                            <i class="material-icons">delete</i>
                        </a>
                    </span>
                </li>
            `);
        } else if (e.type == "folder") {
            // TODO: add feature for determining openness
            html = html.concat(`
                <li>
                    <div class="collapsible-header" file_path="${
                        filePath + e.name
                    }">
                        ${e.name}
                        <span>
                            <a class="waves-effect waves-blue btn-flat">
                                <i class="material-icons">add</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat">
                                <i class="material-icons">create_new_folder</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat">
                                <i class="material-icons">edit</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat">
                                <i class="material-icons">delete</i>
                            </a
                        </span>
                    </div>
                    ${filesToHtml(e.contents, filePath + e.name + "/")}
                </li>
            `);
        }
    });
    return html + `</ul>`;
}

function refreshFiles(fileStructure = null) {
    document.getElementById("menuPreloaderContainer").style.display = "block";
    if (fileStructure != null) {
        document.getElementById("foldersMenu").innerHTML = filesToHtml(
            fileStructure
        );
        // reinitiate popups
        var elems = document.querySelectorAll(".collapsible.expandable");
        var instances = M.Collapsible.init(elems, {
            accordion: false,
            inDuration: 200,
            outDuration: 200,
        });
        document.getElementById("menuPreloaderContainer").style.display =
            "none";
    } else {
        parent.postMessage({ researchyAction: "getFiles" });
    }
}

function MessageHandler() {
    const obj = {};
    obj.handleMessage = function (event) {
        if (typeof obj[event.data.researchyAction] === "function") {
            obj[event.data.researchyAction](event.data);
        }
    };
    return obj;
}

var messageHandler = new MessageHandler();

messageHandler.refreshFiles = (data) => {
    var storage = data.storage;
    var fs = new FileSystem(storage);
    currentFileStructure = fs.contents;
    document.getElementById("foldersMenu").innerHTML = filesToHtml(
        storage.fileSystem.contents
    );
    activeFilePath = storage.activeFilePath;
    activeFile = storage["FILE_" + activeFilePath];
    activeFileContents = activeFile.delta || DEFAULT_FILE;
    quill.setContents(activeFileContents);

    // TODO: remember location
    quill.focus();
    quill.setSelection(activeFile.selection);

    // reinitiate popups
    var elems = document.querySelectorAll(".collapsible.expandable");
    var instances = M.Collapsible.init(elems, {
        accordion: false,
        inDuration: 200,
        outDuration: 200,
    });

    document.addEventListener("click", (e) => {
        if (e.target.matches("li.fileItem")) {
            document.getElementById("editorPreloaderContainer").style.display =
                "block";
            activeFilePath = e.target.getAttribute("file_path");
            parent.postMessage({
                researchyAction: "switchFile",
                filePath: activeFilePath,
            });
        }
    });
    document.getElementById("menuPreloaderContainer").style.display = "none";
};

messageHandler.sidebarActivated = () => quill.focus();
messageHandler.updateFile = () =>
    quill.updateContents(event.data.delta.partial);
messageHandler.updateSelection = () =>
    quill.setSelection(event.data.delta.selection);
messageHandler.switchFile = () => {
    activeFile = event.data.fileContents;

    document
        .getElementById("fileSystemMenu")
        .classList.remove("fileSystemActive");
    quill.setContents(activeFile.delta);
    quill.focus();
    quill.setSelection(activeFile.selection);

    var activeFileName = event.data.filePath.split("/");
    if (activeFileName.length == 1) {
        activeFileName = activeFileName[0].slice(5);
    } else {
        activeFileName = activeFileName.slice(-1)[0];
    }
    document.getElementById("filenameInput").value = activeFileName;
    document.getElementById("editorPreloaderContainer").style.display = "none";
};

window.addEventListener("message", messageHandler.handleMessage);

// window.addEventListener("message", (event) => {
//     // cursor position constant
//     // console.log(event);
//     switch (event.data.researchyAction) {
//         case "refreshFiles":
//             var storage = event.data.storage;
//             var fs = new FileSystem(storage);
//             currentFileStructure = fs.contents;
//             document.getElementById("foldersMenu").innerHTML = filesToHtml(
//                 storage.fileSystem.contents
//             );
//             console.log(storage);
//             activeFilePath = storage.activeFilePath;
//             activeFile = storage["FILE_" + activeFilePath];
//             activeFileContents = activeFile.delta || DEFAULT_FILE;
//             quill.setContents(activeFileContents);

//             // TODO: remember location
//             quill.focus();
//             quill.setSelection(activeFile.selection);

//             // reinitiate popups
//             var elems = document.querySelectorAll(".collapsible.expandable");
//             var instances = M.Collapsible.init(elems, {
//                 accordion: false,
//                 inDuration: 200,
//                 outDuration: 200,
//             });

//             document.addEventListener("click", (e) => {
//                 if (e.target.matches("li.fileItem")) {
//                     document.getElementById(
//                         "editorPreloaderContainer"
//                     ).style.display = "block";
//                     activeFilePath = e.target.getAttribute("file_path");
//                     parent.postMessage({
//                         researchyAction: "switchFile",
//                         filePath: activeFilePath,
//                     });
//                 }
//             });
//             document.getElementById("menuPreloaderContainer").style.display =
//                 "none";
//             break;
//         case "sidebarActivated":
//             quill.focus();
//             break;
//         case "updateFile":
//             quill.updateContents(event.data.delta.partial);
//             break;
//         case "updateSelection":
//             quill.setSelection(event.data.delta.selection);
//             break;
//         case "switchFile":
//             activeFile = event.data.fileContents;

//             document
//                 .getElementById("fileSystemMenu")
//                 .classList.remove("fileSystemActive");
//             quill.setContents(activeFile.delta);
//             quill.focus();
//             quill.setSelection(activeFile.selection);

//             var activeFileName = event.data.filePath.split("/");
//             if (activeFileName.length == 1) {
//                 activeFileName = activeFileName[0].slice(5);
//             } else {
//                 activeFileName = activeFileName.slice(-1)[0];
//             }
//             document.getElementById("filenameInput").value = activeFileName;
//             document.getElementById("editorPreloaderContainer").style.display =
//                 "none";
//             break;
//     }
// });

// Store accumulated changes
var change = new Delta();
quill.on("text-change", (delta, oldDelta, source) => {
    if (source == "user") {
        change = change.compose(delta);
        parent.postMessage({
            researchyAction: "updateFile",
            contents: {
                filePath: activeFilePath,
                partial: delta,
            },
        });
    }
});

quill.on("selection-change", (range, oldRange, source) => {
    if (source == "user") {
        parent.postMessage({
            researchyAction: "updateSelection",
            contents: {
                filePath: activeFilePath,
                selection: range,
            },
        });
    }
});

refreshFiles();
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".dropdown-trigger");
    var instances = M.Dropdown.init(elems);
});
