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

let dropdownInstances;

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

function refreshFiles(fileStructure = null) {
    document.getElementById("menuPreloaderContainer").style.display = "block";
    if (fileStructure != null) {
        document.getElementById("foldersMenu").innerHTML = fs.html;
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

function removeEventListeners(node) {
    let newNode = node.cloneNode(true);
    node.parentNode.replaceChild(newNode, newNode);
    return node;
}

var messageHandler = new VanillaMessageHandler();

messageHandler.refreshFiles = (data) => {
    let storage = data.storage;
    fs = new FileSystemClient(storage);
    console.log(storage, fs);
    fs.refresh();
};

messageHandler.sidebarActivated = () => quill.focus();
messageHandler.updateFile = () =>
    quill.updateContents(event.data.delta.partial);
// messageHandler.updateSelection = () =>
//     quill.setSelection(event.data.delta.selection);
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
    if (source == "user" && range != null) {
        fs.updateSelection(fs.activeFilePath, range);
    }
});

refreshFiles();

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".dropdown-trigger");
    dropdownInstances = M.Dropdown.init(elems);
});

document.addEventListener("click", (event) => {
    if (event.target.matches("li.fileItem")) {
        fs.activateFile(event.target.getAttribute("file_path"));
    }
});

let changeHandler = (event) => {
    if (event.which == 13) {
        // on enter
        let path =
            fs.changeMode == "rename"
                ? fs.changePath
                : fs.changePath.split("/").slice(0, -1).join("/");
        if (fs.get(path).child(NAMER.value)) {
            NAMER.classList.add("invalid");
            NAMER.classList.remove("valid");
        } else {
            NAMER.classList.add("valid");
            NAMER.classList.remove("invalid");
            if (fs.changeMode == "file") fs.newFile(fs.changePath, NAMER.value);
            else if (fs.changeMode == "folder")
                fs.newFolder(fs.changePath, NAMER.value);
            else fs.rename(fs.changePath, NAMER.value);
            NAMER_CONTAINER.classList.remove("active");
            // NAMER.removeEventListener("keyup", plusHandler);
        }
    }
};

document.addEventListener(
    "click",
    (event) => {
        let btn = event.target.closest(".file-folder-action");
        if (btn == null) {
            if (!event.target.closest("#namerContainer")) {
                NAMER_CONTAINER.classList.remove("active");
                NAMER.classList.remove("valid");
                NAMER.classList.remove("invalid");
                NAMER.value = "";
                NAMER.removeEventListener("keyup", changeHandler);
            }
            return;
        }
        let item = btn.closest(".file-folder-item");
        let path;
        if (item == null && btn.closest("#addItem")) path = "";
        else path = item.getAttribute("file_path");
        let action = btn.children[0].innerHTML;

        event.stopPropagation();
        switch (action) {
            case "delete":
                fs.delete(path);
                item.remove();
                break;
            case "add":
                NAMER_CONTAINER.classList.add("active");
                document.querySelector("label[for='namer']").innerHTML =
                    "New file name:";
                NAMER.value = "";
                NAMER.focus();
                fs.changePath = path;
                fs.changeMode = "file";
                NAMER.addEventListener("keyup", changeHandler);
                // activate
                break;
            case "edit":
                NAMER_CONTAINER.classList.add("active");
                document.querySelector("label[for='namer']").innerHTML =
                    "Rename:";
                NAMER.value = "";
                NAMER.focus();
                fs.changePath = path;
                fs.changeMode = "rename";
                NAMER.addEventListener("keyup", changeHandler);
                break;
            case "create_new_folder":
                NAMER_CONTAINER.classList.add("active");
                document.querySelector("label[for='namer']").innerHTML =
                    "New folder name:";
                NAMER.value = "";
                NAMER.focus();
                fs.changePath = path;
                fs.changeMode = "folder";
                NAMER.addEventListener("keyup", changeHandler);
                break;
        }
    },
    true
);

// add unfocus

function renameFromInput() {
    let path = fs.activeFilePath.split("/").slice(0, -1).join("/");
    if (fs.get(path + "/" + FileSystemClient.renamer.value)) {
        if (FileSystemClient.renamer.value == fs.activeFileName) {
            FileSystemClient.renamer.classList.remove("invalid");
            FileSystemClient.renamer.classList.remove("valid");
            quill.focus();
        } else {
            FileSystemClient.renamer.classList.add("invalid");
            FileSystemClient.renamer.classList.remove("valid");
            FileSystemClient.renamer.focus();
        }
    } else {
        FileSystemClient.renamer.classList.add("valid");
        FileSystemClient.renamer.classList.remove("invalid");
        fs.rename(fs.activeFilePath, FileSystemClient.renamer.value);
        fs.activeFilePath = path + "/" + FileSystemClient.renamer.value;
        quill.focus();
    }
}

FileSystemClient.renamer.addEventListener("blur", renameFromInput);

FileSystemClient.renamer.addEventListener("keyup", (event) => {
    if (event.which == 13) {
        // TODO USE LET AND CONST
        renameFromInput();
    }
});
