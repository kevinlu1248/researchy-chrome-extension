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

const DEFAULT_FILE = {
    ops: [
        { insert: "Title" },
        { attributes: { header: 1 }, insert: "\n" },
        { insert: "Pursue your scholarly desires..." },
    ],
};

var activeFilePath, activeFileContents, currentFileStructure;

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

[
    [{ header: 1 }, { header: 2 }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [
        { script: "sub" },
        { script: "super" },
        "blockquote",
        "code-block",
        "formula",
    ],
    [{ color: [] }, { background: [] }],
];

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
                        : currentFolder[i].contents;
                break;
            }
        }
    });
    return currentFolder;
}

function filesToHtml(fileStructure, filePath = "") {
    // recursively generate a doc
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
            console.log(e);
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

function refreshFileStructure(fileStructure = null) {
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
        parent.postMessage({ researchyAction: "getFileStructure" });
    }
}

window.addEventListener("message", (event) => {
    // cursor position constant
    console.log(event, event.data);
    if (event.data.researchyAction == "refreshFileStructure") {
        currentFileStructure = event.data.fileSystem;
        document.getElementById("foldersMenu").innerHTML = filesToHtml(
            event.data.fileSystem
        );
        // reinitiate popups
        var elems = document.querySelectorAll(".collapsible.expandable");
        var instances = M.Collapsible.init(elems, {
            accordion: false,
            inDuration: 200,
            outDuration: 200,
        });
        activeFilePath = event.data.activeFilePath;
        activeFile = getContentsFromFilePath(event.data.activeFilePath);
        activeFileContents = activeFile.contents || DEFAULT_FILE;
        quill.setContents(activeFileContents);
        quill.focus();
        document.getElementById("menuPreloaderContainer").style.display =
            "none";
    } else if (event.data.researchyAction == "sidebarActivated") {
        quill.focus();
    }
});

refreshFileStructure();

// Store accumulated changes
var change = new Delta();
quill.on("text-change", (delta, oldDelta, source) => {
    change = change.compose(delta);
    console.log(delta);
    parent.postMessage({
        researchyAction: "updateFile",
        contents: { filePath: activeFilePath, partial: delta },
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".dropdown-trigger");
    var instances = M.Dropdown.init(elems);
});
