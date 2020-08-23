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

let fs;
const NAMER_CONTAINER = document.getElementById("namerContainer");
const NAMER = document.getElementById("namer");

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

function getContentsFromFilePath(filePath, fileStructure = fs) {
    // uses filepath to find content of that structure within fs
    // TODO: Add error management
    var currentFolder = fs;
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

function filesToHtml(fs, filePath = "") {
    // recursively generate a doc
    var html = `<ul class="${
        !filePath ? "" : "collapsible-body " // check if initial
    }collapsible expandable">`;
    fs.forEach((e) => {
        if (e.type == "rtf") {
            html = html.concat(`
                <li class="fileItem waves-effect waves-blue btn-flat file-folder-item" file_path="${
                    filePath + e.name
                }">
                    ${e.name}
                    <span>
                        <a class="waves-effect waves-blue btn-flat file-folder-action">
                            <i class="material-icons">delete</i>
                        </a>
                    </span>
                </li>
            `);
        } else if (e.type == "folder") {
            // TODO: add feature for determining openness
            html = html.concat(`
                <li>
                    <div class="collapsible-header file-folder-item" file_path="${
                        filePath + e.name
                    }">
                        ${e.name}
                        <span>
                            <a class="waves-effect waves-blue btn-flat file-folder-action">
                                <i class="material-icons">add</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat file-folder-action">
                                <i class="material-icons">create_new_folder</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat file-folder-action">
                                <i class="material-icons">edit</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat file-folder-action">
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

var messageHandler = new VanillaMessageHandler();

messageHandler.refreshFiles = (data) => {
    let storage = data.storage;
    console.log(data, storage);
    fs = new FileSystemClient(storage.contents, storage.activeFilePath);
    document.getElementById("foldersMenu").innerHTML = filesToHtml(
        fs.contents // TODO FIX
    );
    quill.setContents(fs.activeFile.delta);
    document.getElementById("filenameInput").value = fs.activeFileName;

    // TODO: remember location
    quill.focus();
    quill.setSelection(fs.activeFile.selection);
    console.log(fs.activeFile.selection);

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
            fs.activeFilePath = e.target.getAttribute("file_path");

            document
                .getElementById("fileSystemMenu")
                .classList.remove("fileSystemActive");
            quill.setContents(fs.activeFile.delta);
            quill.focus();
            quill.setSelection(fs.activeFile.selection);
            document.getElementById("filenameInput").value = fs.activeFileName;
            document.getElementById("editorPreloaderContainer").style.display =
                "none";
        }
    });

    document.getElementById("menuPreloaderContainer").style.display = "none";
    document.getElementById("editorPreloaderContainer").style.display = "none";
};

messageHandler.sidebarActivated = () => quill.focus();
messageHandler.updateFile = () =>
    quill.updateContents(event.data.delta.partial);
messageHandler.updateSelection = () =>
    quill.setSelection(event.data.delta.selection);
messageHandler.switchFile = () => {
    activeFile = new File(event.data.file);
    console.log(activeFile);

    document
        .getElementById("fileSystemMenu")
        .classList.remove("fileSystemActive");
    quill.setContents(activeFile.delta);
    quill.focus();
    quill.setSelection(activeFile.selection);
    document.getElementById("filenameInput").value = fs.activeFileName;
    document.getElementById("editorPreloaderContainer").style.display = "none";
};

window.addEventListener("message", messageHandler.handleMessage);

// Store accumulated changes
var change = new Delta();
quill.on("text-change", (delta, oldDelta, source) => {
    if (source == "user") {
        partial = change.compose(delta);
        fs.update(fs.activeFilePath, partial);
    }
});

quill.on("selection-change", (range, oldRange, source) => {
    if (source == "user") {
        fs.updateSelection(fs.activeFilePath, range);
    }
});

refreshFiles();

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".dropdown-trigger");
    var instances = M.Dropdown.init(elems);
});

document.addEventListener("click", (event) => {});

document.addEventListener("click", (event) => {
    let btn = event.target.closest(".file-folder-action");
    if (btn == null) {
        console.log(event.target.closest("#namerContainer"));
        if (!event.target.closest("#namerContainer")) {
            NAMER_CONTAINER.classList.remove("active");
            NAMER.classList.remove("valid");
            NAMER.classList.remove("invalid");
            NAMER.value = "";
        }
        return;
    }
    let item = btn.closest(".file-folder-item");
    let path = btn.closest(".file-folder-item").getAttribute("file_path");
    let action = btn.children[0].innerHTML;

    event.preventDefault();
    switch (action) {
        case "delete":
            fs.delete(path);
            item.remove();
            break;
        case "add":
            NAMER_CONTAINER.classList.add("active");
            NAMER.value = "";
            NAMER.focus();
            let handler = (event) => {
                if (event.which == 13) {
                    // on enter
                    if (fs.child(NAMER.value)) {
                        NAMER.classList.add("invalid");
                        NAMER.classList.remove("valid");
                    } else {
                        NAMER.classList.add("valid");
                        NAMER.classList.remove("invalid");
                        fs.newFile(path, NAMER.value);
                        NAMER_CONTAINER.classList.remove("active");
                        NAMER.removeEventListener("keyup", handler);
                    }
                }
            };
            NAMER.addEventListener("keyup", handler);
            break;
        case "edit":
            break;
        case "create_new_folder":
            break;
    }
});
