let messageCounter = 0;

var sendMessage = (message) => {
	message.receiver = "fs";
	message.id = messageCounter++;
	parent.postMessage(message);
	return new Promise((resolve, reject) => {
		window.addEventListener(
			"message",
			(event) => {
				if (event.data.id == message.id) {
					resolve(event.data.response);
				}
			},
			{ once: true }
		);
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
		let headerDom = document.querySelector(
			`.collapsible-header[file_path="${path}"]`
		);
		headerDom.childNodes[0].replaceWith(newName);
	}

	newFile(path, name) {
		super.newFile(path, name);
		fsMessage({
			researchyAction: "newFile",
			path: path,
			name: name,
		});
		let folderDom =
			path == ""
				? document.querySelector("#foldersMenu > ul")
				: document.querySelector(
						`.collapsible-header[file_path="${path}"]`
				  ).nextSibling.nextSibling;
		folderDom.insertAdjacentHTML(
			"beforeEnd",
			`<li class="fileItem waves-effect waves-blue btn-flat file-folder-item" file_path="${
				path + name
			}">
                    ${name}
                    <span>
                        <a class="waves-effect waves-blue btn-flat file-folder-action">
                            <i class="material-icons">delete</i>
                        </a>
                    </span>
                </li>
					`
		);
	}

	newFolder(path, name) {
		super.newFolder(path, name);
		fsMessage({
			researchyAction: "newFolder",
			path: path,
			name: name,
		});
		let folderDom =
			path == ""
				? document.querySelector("#foldersMenu > ul")
				: document.querySelector(
						`.collapsible-header[file_path="${path}"]`
				  ).nextSibling.nextSibling;
		folderDom.insertAdjacentHTML(
			"beforeEnd",
			`<li>
                    <div class="collapsible-header file-folder-item" file_path="${
						path + name
					}">
                        ${name}
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
                    <ul class="collapsible-body collapsible expandable" style="display: block;"></ul>
                </li>
					`
		);
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

	get html() {
		return FileSystemClient.buildHtml(this);
	}

	activateFile(path) {
		FileSystemClient.fsLoader.style.display = "block";
		this.activeFilePath = path;
		FileSystemClient.fsMenuSidebar.classList.remove("fileSystemActive");
		quill.setContents(this.activeFile.delta);
		quill.focus();
		quill.setSelection(this.activeFile.selection || File.DEFAULT_SELECTION);
		FileSystemClient.renamer.value = this.activeFile.name;
		FileSystemClient.fsLoader.style.display = "none";
	}

	refresh() {
		FileSystemClient.fsMenu.innerHTML = this.html;
		quill.setContents(this.activeFile.delta);
		FileSystemClient.renamer.value = this.activeFileName;

		// TODO: remember location
		quill.focus();
		quill.setSelection(this.activeFile.selection);

		// reinitiate popups
		var elems = document.querySelectorAll(".collapsible.expandable");
		var instances = M.Collapsible.init(elems, {
			accordion: false,
			inDuration: 200,
			outDuration: 200,
		});

		document.getElementById("menuPreloaderContainer").style.display =
			"none";
		document.getElementById("editorPreloaderContainer").style.display =
			"none";
	}

	static buildHtml(folder, path = "") {
		// recursively generate a doc
		var html = `<ul class="${
			!path ? "" : "collapsible-body " // check if initial
		}collapsible expandable">`;
		folder.contents.forEach((item) => {
			if (item.type == "rtf") {
				html = html.concat(`
                <li class="fileItem waves-effect waves-blue btn-flat file-folder-item" file_path="${
					path + item.name
				}">
                    ${item.name}
                    <span>
                        <a class="waves-effect waves-blue btn-flat file-folder-action">
                            <i class="material-icons">delete</i>
                        </a>
                    </span>
                </li>
            `);
			} else if (item.type == "folder") {
				// TODO: add feature for determining openness
				html = html.concat(`
                <li class="${item.isOpen ? "active" : ""}">
                    <div class="collapsible-header file-folder-item" file_path="${
						path + item.name
					}">
                        ${item.name}
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
                    ${FileSystemClient.buildHtml(item, path + item.name + "/")}
                </li>
            `);
			}
		});
		return html + `</ul>`;
	}
}

// sendMessage({
// 	researchyAction: "get",
// 	path: "Third/File 1",
// }).then((file) => {
// 	console.log(file);
// 	console.log(new File(file), "success");
// });
