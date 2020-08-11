"use strict";
// maybe add date
var Delta = Quill.import("delta");

const DEFAULT_DELTA = {
	ops: [
		{ insert: "Title" },
		{ attributes: { header: 1 }, insert: "\n" },
		{ insert: "Pursue your scholarly desires..." },
	],
};
const DEFAULT_SELECTION = {
	index: 0,
	length: 0,
};

class File {
	constructor(name, delta, selection) {
		this.name = name;
		this.delta = new Delta(contents);
		this.length = contents.length; // double check
		this.selection = selection;
	}
	updateDelta(partial) {
		this.delta = this.delta.compose(new Delta(partial));
	}
}

class Folder {
	constructor(name, contents) {
		// contents an array of files and folders
		this.name = name;
		this.contents = contents;
	}
	getItem(name) {
		for (var i = 0; i < this.contents.length; i++) {
			if (this.contents[i].name == name) {
				return this.contents[i];
			}
		}
	}
}

class FileSystem extends Folder {}
