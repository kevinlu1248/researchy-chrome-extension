"use strict";

import React from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/react-dom` if it exists or... Remove this comment to see the full error message
import ReactDOM from "react-dom";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/classnames` if it exists o... Remove this comment to see the full error message
import classNames from "classnames";

// @ts-expect-error ts-migrate(6142) FIXME: Module './FileSystem/FileSystemC.jsx' was resolved... Remove this comment to see the full error message
import FileSystemC from "./FileSystem/FileSystemC.jsx";
// @ts-expect-error ts-migrate(6142) FIXME: Module './Editor/Editor.jsx' was resolved to '/hom... Remove this comment to see the full error message
import Editor from "./Editor/Editor.jsx";

type State = any;

class Sidebar extends React.Component<{}, State> {
    _asyncRequest: any;
    editorRef: any;
    constructor(props: {}) {
        super(props);
        this.editorRef = React.createRef();
        this.focusEditor = this.focusEditor.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.state = {
            fileSystemIsActive: false,
            fs: null,
        };
    }

    focusEditor() {
        this.editorRef.current.focus();
    }

    setSelection(selection: any) {
        this.editorRef.current.getEditor().setSelection(selection);
    }

    refresh() {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'FileSystemClient'.
        this._asyncRequest = FileSystemClient.fs.then((fs: any) => {
            this._asyncRequest = null;
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'fs' does not exist on type 'Window & typ... Remove this comment to see the full error message
            window.fs = fs;
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'FileSystemClient'.
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

    handleToggleFileSystem(isOpen: any) {
        this.setState({ fileSystemIsActive: isOpen });
    }

    // @ts-expect-error ts-migrate(7019) FIXME: Rest parameter 'params' implicitly has an 'any[]' ... Remove this comment to see the full error message
    handleUpdateFs(action: any, ...params) {
        this.state.fs[action](...params);
    }

    handleActivateFile(filePath: any) {
        const fs = this.state.fs;
        fs.activeFilePath = filePath;
        this.setState({ fs: fs, fileSystemIsActive: false }, () =>
            this.setSelection(this.state.fs.activeFile.selection)
        );
    }

    handleRename(newName: any) {
        const fs = this.state.fs;
        fs.rename(this.state.fs.activeFilePath, newName);
        fs.activeFilePath = fs.activeFolderName + "/" + newName;
        this.setState({ fs: fs });
        this.setSelection(this.state.fs.activeFile.selection);
    }

    render() {
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        return <>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <FileSystemC
                fs={this.state.fs}
                isActive={this.state.fileSystemIsActive}
                // @ts-expect-error ts-migrate(7019) FIXME: Rest parameter 'params' implicitly has an 'any[]' ... Remove this comment to see the full error message
                onUpdateFs={(action: any, ...params) =>
                    this.handleUpdateFs(action, ...params)
                }
                onCloseFileSystem={() => this.handleToggleFileSystem(false)}
                onActivateFile={(filePath: any) => this.handleActivateFile(filePath)
                }
            />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Editor
                fs={this.state.fs}
                activeFilePath={
                    this.state.fs === null
                        ? null
                        : this.state.fs.activeFilePath
                }
                onOpenFileSystem={() => this.handleToggleFileSystem(true)}
                // @ts-expect-error ts-migrate(7019) FIXME: Rest parameter 'params' implicitly has an 'any[]' ... Remove this comment to see the full error message
                onUpdateFs={(action: any, ...params) =>
                    this.handleUpdateFs(action, ...params)
                }
                editorRef={this.editorRef}
                onRename={(newName: any) => this.handleRename(newName)}
            />
        </>;
    }
}

// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
ReactDOM.render(<Sidebar />, document.querySelector("#app"));
