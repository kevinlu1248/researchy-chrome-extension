class SyncedFileSystem extends FileSystem {
	// essentially folder but with storage interactions

	constructor(contents, activeFile = null, doSyncImmediately = false) {
		if (contents == undefined) contents = "DEFAULT";
		super(contents, activeFile);
		this.updateStorage();
		this.allFiles = this.dfsFiles();
		if (doSyncImmediately) {
			let keys = Object.keys(this.allFiles);
			var storage = {};
			keys.forEach((key) => {
				storage["FILE_" + key] = this.allFiles[key];
			});
			chrome.storage.sync.set(storage);
		}
	}

	set(path, newItem) {
		super.set(path, newItem);
		var newName =
			path.split("/").slice(0, -1).join("/") + "/" + newItem.name;
		this.updateStorage(newName);
	}

	newFile(path, newItem) {
		super.newFile(path, newItem);
		this.updateStorage(path);
	}

	rename(path, name) {
		super.rename(path, name);
		this.updateStorage(path);
		var storage = {};
		storage["FILE_" + path] = null;
		chrome.storage.sync.set(storage);
	}

	newFolder(path, name) {
		super.newFolder(path, name);
		this.updateStorage();
	}

	update(path, partial) {
		super.update(path, partial);
		this.updateStorage(path);
	}

	updateSelection(path, selection) {
		super.updateSelection(path, selection);
		this.updateStorage(path);
	}

	delete(path) {
		super.delete(path);
		this.updateStorage();
		path = path.split("/").slice(0, -1).join("/");
		var files = this.get(path).dfsFiles();
		var keys = Object.keys(files);
		keys.forEach((key) => {
			chrome.storage.sync.remove("FILE_" + key);
		});
	}

	updateStorage(path) {
		var storage = { fileSystem: this };
		if (path) {
			storage["FILE_" + path] = super.get(path);
		}
		chrome.storage.sync.set(storage);
	}

	static logStorage() {
		chrome.storage.sync.get(null, console.log);
	}

	static get fs() {
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get(null, (storage) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				}
				var fs;
				if (storage.fileSystem) {
					fs = new SyncedFileSystem(storage.fileSystem);
				} else {
					fs = new SyncedFileSystem("DEFAULT_FILES");
				}
				resolve(fs);
			});
		});
	}
}
