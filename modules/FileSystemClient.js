let messageCounter = 0;

var sendMessage = (message) => {
	message.receiver = "background";
	message.id = messageCounter++;
	parent.postMessage(message);
	return new Promise((resolve, reject) => {
		window.addEventListener(
			"message",
			(event) => {
				if (event.data.id == message.id) {
					resolve(...event.data.response);
				}
			},
			{ once: true }
		);
	});
};

// class FileSystemClient extends FileSystem {
// 	get = (path) => sendMessage({ researchyAction: "get", path: path });
// 	set = (path, newItem) =>
// 		sendMessage({ researchyAction: "get", path: path, newItem: newItem });
// 	rename = (path) => sendMessage({ researchyAction: "get", path: path, newItem: newItem });
// 	newFile() {}
// 	newFolder() {}
// 	delete() {}
// 	update() {}
// }

// sendMessage({
// 	researchyAction: "get",
// 	path: "Third/File 1",
// }).then((file) => {
// 	console.log(new File(file), "success");
// });
