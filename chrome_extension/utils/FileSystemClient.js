let messageCounter = 0;

let sendMessage = (message) => {
    message.receiver = "fs";
    message.id = messageCounter++;
    parent.postMessage(message);
    return new Promise((resolve, reject) => {
        let handler = (event) => {
            if (event.data.id == message.id) {
                resolve(event.data.response);
                window.removeEventListener("messsage", handler);
            }
        };
        console.log(window);
        window.addEventListener("message", handler);
    });
};

let fsMessage = (message) => {
    message.receiver = "fs";
    parent.postMessage(message);
};

class FileSystemClient extends FileSystem {
    static fsMenuSidebar = document.getElementById("fileSystemMenu");
    static fsMenu = document.getElementById("foldersMenu");
    static fsLoader = document.getElementById("editorPreloaderContainer");
    static renamer = document.getElementById("filenameInput");

    static get fs() {
        return sendMessage({ researchyAction: "get", path: "" });
    }

    set(path, newItem) {
        super.set(path, newItem);
        fsMessage({
            researchyAction: "set",
            path: path,
            newItem: newItem,
        });
    }

    rename(path, newName) {
        super.rename(path, newName);
        fsMessage({
            researchyAction: "rename",
            path: path,
            newName: newName,
        });
    }

    newFile(path, name) {
        super.newFile(path, name);
        fsMessage({
            researchyAction: "newFile",
            path: path,
            name: name,
        });
    }

    newFolder(path, name) {
        super.newFolder(path, name);
        fsMessage({
            researchyAction: "newFolder",
            path: path,
            name: name,
        });
    }

    delete(path) {
        super.delete(path);
        fsMessage({
            researchyAction: "delete",
            path: path,
        });
    }

    update(path, partial) {
        super.update(path, partial);
        fsMessage({
            researchyAction: "update",
            path: path,
            partial: partial,
        });
    }

    updateSelection(path, selection) {
        super.updateSelection(path, selection);
        fsMessage({
            researchyAction: "updateSelection",
            path: path,
            selection: selection,
        });
    }
}
