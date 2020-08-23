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
	set(path, newItem) {
		super.set(path, newItem);
		fsMessage({
			researchyAction: "set",
			path: path,
			newItem: newItem,
		});
	}

	rename(path, newName) {
		super.rename(path, newItem);
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

// sendMessage({
// 	researchyAction: "get",
// 	path: "Third/File 1",
// }).then((file) => {
// 	console.log(file);
// 	console.log(new File(file), "success");
// });
