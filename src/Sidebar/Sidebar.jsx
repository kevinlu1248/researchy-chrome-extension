"use strict";

import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import FileSystemC from "./FileSystem/FileSystemC.jsx";
import Editor from "./Editor/Editor.jsx";

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.editorRef = React.createRef();
        this.focusEditor = this.focusEditor.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.state = {
            fileSystemIsActive: false,
            fs: null
        };
    }

    focusEditor() {
        this.editorRef.current.focus();
    }

    setSelection(selection) {
        this.editorRef.current.getEditor().setSelection(selection);
    }

    refresh() {
        this._asyncRequest = FileSystemClient.fs.then((fs) => {
            console.log(fs);
            this._asyncRequest = null;
            window.fs = fs;
            this.setState({ fs: new FileSystemClient(fs) }, () =>
                this.setSelection(this.state.fs.activeFile.selection)
            );
        });
    }

    componentDidMount() {
        this.refresh();
    }

    componentWillUnmount() {
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
    }

    handleToggleFileSystem(isOpen) {
        this.setState({ fileSystemIsActive: isOpen });
    }

    handleUpdateFs(action, ...params) {
        this.state.fs[action](...params);
    }

    handleActivateFile(filePath) {
        const fs = this.state.fs;
        fs.activeFilePath = filePath;
        this.setState({ fs: fs, fileSystemIsActive: false }, () =>
            this.setSelection(this.state.fs.activeFile.selection)
        );
    }

    handleRename(newName) {
        const fs = this.state.fs;
        fs.rename(this.state.fs.activeFilePath, newName);
        fs.activeFilePath = fs.activeFolderName + "/" + newName;
        this.setState({ fs: fs });
        this.setSelection(this.state.fs.activeFile.selection);
    }

    render() {
        return (
            <>
                <FileSystemC
                    fs={this.state.fs}
                    isActive={this.state.fileSystemIsActive}
                    onUpdateFs={(action, ...params) =>
                        this.handleUpdateFs(action, ...params)
                    }
                    onCloseFileSystem={() => this.handleToggleFileSystem(false)}
                    onActivateFile={(filePath) =>
                        this.handleActivateFile(filePath)
                    }
                />
                <Editor
                    fs={this.state.fs}
                    activeFilePath={
                        this.state.fs === null
                            ? null
                            : this.state.fs.activeFilePath
                    }
                    onOpenFileSystem={() => this.handleToggleFileSystem(true)}
                    onUpdateFs={(action, ...params) =>
                        this.handleUpdateFs(action, ...params)
                    }
                    editorRef={this.editorRef}
                    onRename={(newName) => this.handleRename(newName)}
                />
            </>
        );
    }
}

ReactDOM.render(<Sidebar />, document.querySelector("#app"));
