"use strict";
// maybe add date
var Delta = Quill.import("delta");

class StoredItem {
	// Abstract class
	constructor() {
		if (this.constructor === StoredItem) {
			throw new Error("Can't instantiate abstract class!");
		}
		this.timeCreated = this.timeCreated || new Date();
		this.timeModified = this.timeModified || this.timeCreated;
	}

	json() {
		return JSON.parse(JSON.stringify(this));
	}
}

class File extends StoredItem {
	static DEFAULT_DELTA = new Delta({
		ops: [
			{ insert: "Title" },
			{ attributes: { header: 1 }, insert: "\n" },
			{ insert: "Pursue your scholarly desires..." },
		],
	});

	static DEFAULT_SELECTION = {
		index: 0,
		length: 0,
	};

	static DEFAULT_PROPERTIES = {
		delta: File.DEFAULT_DELTA,
		selection: File.DEFAULT_SELECTION,
	};

	constructor({ name, delta, selection } = {}) {
		// file mainly oriented around delta
		super();

		this.name = name || null;
		this.delta = delta ? new Delta(delta) : File.DEFAULT_PROPERTIES.delta;
		this.selection = selection || File.DEFAULT_PROPERTIES.selection;

		this.type = "rtf";
		this.length = this.delta ? this.delta.length() : 0;
	}

	update(partial) {
		this.delta = this.delta.compose(new Delta(partial));
		this.length = this.delta.length();
		this.timeModified = new Date();
	}

	concat(delta) {
		this.delta = this.delta.concat(new Delta(partial));
		this.length = this.delta.length();
		this.timeModified = new Date();
	}

	rewrite(delta) {
		this.delta = new Delta(delta);
		this.length = this.delta.length();
		this.timeModified = new Date();
	}
}

class Folder extends StoredItem {
	static DEFAULT_FOLDER = [
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

	constructor({ name, contents, isOpen } = {}) {
		// contents an array of files and folders
		super();

		if (contents == "DEFAULT")
			contents = Folder.folderify(Folder.DEFAULT_FOLDER);

		this.name = name || null;
		this.contents = contents ? Folder.folderify(contents) : [];
		this.isOpen = isOpen || false;
		this.type = "folder";
		this.length = this.contents.length || 0;
	}

	static folderify(contents) {
		// changes json objects into Files and Folders
		var result = [];
		for (var i = 0; i < contents.length; i++) {
			if (contents[i].type === "file" || contents[i].type === "rtf") {
				result.push(new File(contents[i]));
			} else if (contents[i].type === "folder") {
				result.push(new Folder(contents[i]));
			}
		}
		return result;
	}

	child(name) {
		// only direct children
		for (var i = 0; i < this.contents.length; i++) {
			if (this.contents[i].name == name) {
				return this.contents[i];
			}
		}
		return false;
	}

	get(path) {
		// recursive search
		if (path == "" || path == "/") return this;

		if (typeof path === "string") path = path.split("/");
		var nextItem = this.child(path[0]);
		if (
			nextItem == false || // not found
			(path.length > 1 && nextItem instanceof File)
		)
			return false; // terminates on a non-file
		if (path.length == 1) {
			return nextItem;
		} else {
			return nextItem.get(path.slice(1));
		}
	}

	set(path, newItem) {
		// recursive search
		if (typeof path === "string") path = path.split("/");
		var item = this;
		if (this instanceof File) {
			return false;
		} else if (this instanceof Folder && path.length == 1) {
			for (var i = 0; i < item.contents.length; i++) {
				if (item.contents[i].name === path[path.length - 1]) {
					if (typeof item.contents[i] != typeof newItem) {
						return false;
					} else {
						item.contents[i] = newItem;
						return true;
					}
				}
			}
		} else if (this instanceof Folder) {
			return this.child(path.shift()).set(path, newItem);
		}
	}

	rename(path, newName) {
		var item = this.get(path);
		if (item == false) return false;
		item.name = newName;
	}

	newFile(path, name) {
		// places file at path
		if (typeof path === "string") path = path.split("/");
		var folder = this.get(path);
		if (folder == false && folder instanceof Folder) return false;
		if (folder.child(name)) return false; // check namespace
		folder.contents.push(new File({ name: name }));
	}

	newFolder(path, name) {
		// places folder at new path
		if (typeof path === "string") path = path.split("/");
		var folder = this.get(path);
		if (folder.child(name)) return false; // check namespace
		folder.contents.push(new Folder({ name }));
	}

	update(path, partial) {
		// updates delta using a partial
		if (typeof path === "string") path = path.split("/");
		var file = this.get(path);
		if (!file instanceof File) return false;
		file.update(partial);
		var item = this;
		for (var i = 0; i < path.length - 1; i++) {
			item.timeModified = new Date();
			item = item.child(path[i]);
		}
		return true;
	}

	updateSelection(path, selection) {
		if (typeof path === "string") path = path.split("/");
		var file = this.get(path);
		if (!file instanceof File) return false;
		file.selection = selection;
		var item = this;
		for (var i = 0; i < path.length - 1; i++) {
			item.timeModified = new Date();
			item = item.child(path[i]);
		}
		return true;
	}

	toggleOpen(path, doOpen) {
		let item = this.get(path);
		if (item == false) return false;
		item.isOpen = doOpen;
		return true;
	}

	delete(path) {
		if (typeof path === "string") path = path.split("/");
		var fileName = path.pop();
		var folder = this.get(path);
		if (!folder instanceof Folder) return false;
		for (var i = 0; i < folder.contents.length; i++) {
			if (folder.contents[i].name == fileName) {
				folder.contents.splice(i, 1);
			}
		}
		return false;
	}

	dfsFiles() {
		// depth-first-search
		var answer = {};
		for (var i = 0; i < this.contents.length; i++) {
			var item = this.contents[i];
			if (item instanceof File) {
				answer[item.name] = item;
			} else if (item instanceof Folder) {
				var files = item.dfsFiles();
				var keys = Object.keys(files);
				keys.forEach((key) => {
					answer[item.name + "/" + key] = files[key];
				});
				// weird glitch
				// for (var i = 0; i < 1; i++) {}
			}
		}
		return answer;
	}
}

class FileSystem extends Folder {
	constructor({ contents = null, activeFilePath } = {}) {
		super({ name: null, contents: contents });
		this.allFiles = this.dfsFiles();
		this.activeFilePath = activeFilePath || Object.keys(this.allFiles)[0];
	}

	lengthChanged() {
		let sum = 0;
		let keys = Object.keys(this.allFiles);
		for (var i = 0; i < keys.length; i++) {
			sum += this.allFiles[keys[i]].length;
		}
		if (!this.totalLength || this.totalLength != sum) {
			this.totalLength = sum;
			return true;
		} else {
			return false;
		}
	}

	get activeFilePath() {
		return this._activeFilePath;
	}

	set activeFilePath(path) {
		this._activeFilePath = path;
		delete this._activeFileName;
		delete this._activeFile;
	}

	get activeFileName() {
		if (this._activeFileName) return this._activeFileName;
		return (this._activeFileName = this.activeFilePath
			.split("/")
			.slice(-1));
	}

	get activeFile() {
		if (this._activeFile) return this._activeFile;
		return (this._activeFile = this.get(this.activeFilePath));
	}
}

const DEFAULT_FILES = Folder.DEFAULT_FOLDER;
const DEFAULT_FILE = File.DEFAULT_FILE;
