class FileSystemClient extends FileSystem {
    static messageCounter = 0;
    static fsport = chrome.runtime.connect({ name: "fs" });
    // fsport.onMessage.addListener((response) => console.log(response));

    static backgroundMessage(message, port) {
        message.id = FileSystemClient.messageCounter++;
        port.postMessage(message);
        return new Promise((resolve, reject) => {
            let handler = (response) => {
                if (response.id == message.id) {
                    resolve(response.response);
                    port.onMessage.removeListener(handler);
                }
            };
            port.onMessage.addListener(handler);
        });
    }

    static fsMessage(message) {
        FileSystemClient.fsport.postMessage(message);
    }

    static get fs() {
        return FileSystemClient.backgroundMessage(
            { researchyAction: "get", path: "" },
            FileSystemClient.fsport
        );
    }

    set(path, newItem) {
        super.set(path, newItem);
        FileSystemClient.fsMessage({
            researchyAction: "set",
            path: path,
            newItem: newItem
        });
    }

    rename(path, newName) {
        super.rename(path, newName);
        FileSystemClient.fsMessage({
            researchyAction: "rename",
            path: path,
            newName: newName
        });
    }

    newFile(path, name) {
        super.newFile(path, name);
        FileSystemClient.fsMessage({
            researchyAction: "newFile",
            path: path,
            name: name
        });
    }

    newFolder(path, name) {
        super.newFolder(path, name);
        FileSystemClient.fsMessage({
            researchyAction: "newFolder",
            path: path,
            name: name
        });
    }

    delete(path) {
        super.delete(path);
        FileSystemClient.fsMessage({
            researchyAction: "delete",
            path: path
        });
    }

    update(path, partial) {
        super.update(path, partial);
        FileSystemClient.fsMessage({
            researchyAction: "update",
            path: path,
            partial: partial
        });
    }

    updateSelection(path, selection) {
        super.updateSelection(path, selection);
        FileSystemClient.fsMessage({
            researchyAction: "updateSelection",
            path: path,
            selection: selection
        });
    }
}
