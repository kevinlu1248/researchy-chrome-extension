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

const FILE_STRUCTURE_EXAMPLE = [
    {
        type: "folder",
        name: "First",
        contents: [
            {
                type: "folder",
                name: "Second",
                contents: [{ type: "rtf", name: "File 1" }],
            },
            {
                type: "folder",
                name: "Third",
                contents: [{ type: "rtf", name: "File 1" }],
            },
        ],
    },
    {
        type: "folder",
        name: "Second",
        contents: [
            { type: "rtf", name: "File 1" },
            {
                type: "folder",
                name: "Third",
                contents: [{ type: "rtf", name: "File 1" }],
            },
        ],
    },
    {
        type: "folder",
        name: "Third",
        contents: [{ type: "rtf", name: "File 1" }],
    },
];

function filesToHtml(fileStructure, initial = true) {
    // recursively generate a doc
    console.log(fileStructure);
    var html = `<ul class="${
        initial ? "" : "collapsible-body "
    }collapsible expandable">`;
    fileStructure.forEach((e) => {
        if (e.type == "rtf") {
            html = html.concat(`
                <li class="fileItem">
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
            html = html.concat(`
                <li>
                    <div class="collapsible-header">
                        ${e.name}
                        <span>
                            <a class="waves-effect waves-blue btn-flat">
                                <i class="material-icons">add</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat">
                                <i class="material-icons">edit</i>
                            </a>
                            <a class="waves-effect waves-blue btn-flat">
                                <i class="material-icons">delete</i>
                            </a
                        </span>
                    </div>
                    ${filesToHtml(e.contents, false)}
                </li>
            `);
        }
    });
    return html + `</ul>`;
}

function injectFileStructure(fileStructure) {
    console.log(filesToHtml(FILE_STRUCTURE_EXAMPLE));
    document.getElementById("foldersMenu").innerHTML = filesToHtml(
        FILE_STRUCTURE_EXAMPLE
    );
}

// injectFileStructure(FILE_STRUCTURE_EXAMPLE);

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".collapsible.expandable");
    var instances = M.Collapsible.init(elems, {
        accordion: false,
        inDuration: 200,
        outDuration: 200,
    });

    var elems = document.querySelectorAll(".dropdown-trigger");
    var instances = M.Dropdown.init(elems);
});
