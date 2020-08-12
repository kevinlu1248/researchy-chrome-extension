"use strict";
// maybe add date
var Delta = Quill.import("delta");

class StoredItem {
	// Abstract class
	constructor(name, contents) {
		if (this.constructor === StoredItem) {
			throw new Error("Can't instantiate abstract class!");
		}

		if (typeof name === "object" && name != null) {
			var data = name;
			var keys = Object.keys(data);
			for (var i = 0; i < keys.length; i++) {
				this[keys[i]] = data[keys[i]];
			}
		} else {
			this.name = name;
			this.contents = contents;
		}

		this.timeCreated = new Date();
		this.timeModified = this.timeCreated;
	}
}

class File {
	static DEFAULT_DELTA = {
		ops: [
			{ insert: "Title" },
			{ attributes: { header: 1 }, insert: "\n" },
			{ insert: "Pursue your scholarly desires..." },
		],
	};

	static DEFAULT_SELECTION = {
		index: 0,
		length: 0,
	};

	static DEFAULT_PROPERTIES = {
		delta: File.DEFAULT_DELTA,
		selection: File.DEFAULT_SELECTION,
	};

	constructor(name, delta, selection) {
		// file mainly oriented around delta
		if (typeof name === "object" && name != null) {
			var data = name;
			var keys = Object.keys(data);
			for (var i = 0; i < keys.length; i++) {
				this[keys[i]] = data[keys[i]];
			}
		} else {
			this.name = name;
			this.delta = delta;
			this.length = contents.length;
			this.selection = selection;
		}

		this.delta = this.delta || File.DEFAULT_PROPERTIES.delta;
		this.selection = this.selection || File.DEFAULT_PROPERTIES.selection;

		this.timeCreated = new Date();
		this.timeModified = this.timeCreated;
	}
	updateDelta(partial) {
		this.delta = this.delta.compose(new Delta(partial));
	}
}

class Folder {
	constructor(name, contents) {
		// contents an array of files and folders
		if (typeof name === "object" && name != null) {
			var data = name;
			var keys = Object.keys(data);
			for (var i = 0; i < keys.length; i++) {
				if (keys[i] === "contents") {
					this[keys[i]] = folderify(data[keys[i]]);
				} else {
					this[keys[i]] = data[keys[i]];
				}
			}
		} else {
			this.name = name;
			this.contents = folderify(contents);
			this.length = contents.length;
		}

		this.contents = this.contents || {};
		this.length = this.length || 0;

		this.timeCreated = new Date();
		this.timeModified = this.timeCreated;
	}

	static folderify(contents) {
		// changes json objects into Files and Folders
		var result = [];
		for (var i = 0; i < contents.length; i++) {
			if (contents[i].type === "file") {
				result.push(new File(contents[i]));
			} else if (contents[i].type === "folder") {
				result.push(new Folder(contents[i]));
			}
		}
		return result;
	}

	getItemByName(name) {
		for (var i = 0; i < this.contents.length; i++) {
			if (this.contents[i].name == name) {
				return this.contents[i];
			}
		}
		return -1;
	}

	getItemByPath(path) {
		// recursive search
		if (typeof path === "string") path = path.split("/");
		var nextItem = this.contents.getItemByName(path[0]);
		if (
			nextItem == -1 || // not found
			(path.length > 1 && nextItem instanceof File)
		)
			return -1; // terminates on a non-file
		if (nextItem instanceof File) {
			return nextItem;
		} else if (nextItem instanceof Folder) {
			return nextItem.getItemByPath(path.slice(1));
		}
	}
}

class FileSystem extends Folder {}
