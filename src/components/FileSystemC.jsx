"use strict";

import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";

import Skeleton from "@material-ui/lab/Skeleton";
import TextField from "@material-ui/core/TextField";

import FileC from "./FileC.jsx";
import FolderC from "./FolderC.jsx";

let fs;

/*
Components have names {}C since their corresponding name have already
been taken, but this does not apply for the class names
*/

class FileSystemC extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.focusInput = this.focusInput.bind(this);
        this.state = {
            fs: null,
            input: {
                label: "Create New File:",
                isActive: false,
                helperText: "",
                hasError: false,
                value: "",
            },
        };
    }

    refresh() {
        this._asyncRequest = FileSystemClient.fs.then((fs) => {
            this._asyncRequest = null;
            window.fs = fs;
            console.log(this.props);
            this.setState({ fs: new FileSystem(fs) });
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

    focusInput() {
        this.inputRef.focus();
    }

    handleClick() {
        this.setState({ input: { value: "", isActive: false } });
    }

    handleCreateFile(filePath) {
        this.modifyingPath = filePath;
        this.modifyMode = "createFile";
        this.setState({
            input: {
                value: "",
                isActive: true,
                label: "Create New File:",
            },
        });
        this.inputRef.current.focus();
    }

    handleCreateFolder(filePath) {
        this.modifyingPath = filePath;
        this.modifyMode = "createFolder";
        this.setState({
            input: {
                value: "",
                isActive: true,
                label: "Create New Folder:",
            },
        });
        this.inputRef.current.focus();
    }

    handleRename(filePath) {
        this.modifyingPath = filePath;
        this.modifyMode = "rename";
        this.setState({
            input: {
                value: "",
                isActive: true,
                label: "Rename to:",
            },
        });
        this.inputRef.current.focus();
    }

    handleDelete(filePath) {
        const fs = this.state.fs;
        fs.delete(filePath);
        this.setState({ fs: fs });
    }

    handleChange(event) {
        const input = this.state.input;
        input.value = event.target.value;
        this.setState({ input: input });
    }

    handleKeyUp(event) {
        if (event.key == "Enter") {
            const fs = this.state.fs;
            const filePathDirectory =
                this.modifyMode == "rename"
                    ? this.modifyingPath.split("/").slice(0, -1).join()
                    : this.modifyingPath;
            // if rename, then grab its folder
            if (event.target.value == "") {
                this.setState({
                    input: {
                        value: this.state.input.value,
                        label: this.state.input.label,
                        isActive: true,
                        hasError: true,
                        helperText: "Name cannot be empty.",
                    },
                });
            } else if (fs.get(filePathDirectory + "/" + event.target.value)) {
                this.setState({
                    input: {
                        value: this.state.input.value,
                        label: this.state.input.label,
                        isActive: true,
                        hasError: true,
                        helperText: "Name already exists.",
                    },
                });
            } else {
                switch (this.modifyMode) {
                    case "createFile":
                        fs.newFile(this.modifyingPath, event.target.value);
                        break;
                    case "createFolder":
                        fs.newFolder(this.modifyingPath, event.target.value);
                        break;
                    case "rename":
                        fs.rename(this.modifyingPath, event.target.value);
                        break;
                }
                this.setState({
                    fs: fs,
                    input: { value: "", isActive: false },
                });
            }
        }
    }

    render() {
        return this.state.fs === null ? (
            <>
                <Skeleton className="FileSystemC__Skeleton FileSystemC__Skeleton--First" />
                <Skeleton className="FileSystemC__Skeleton" />
                <Skeleton className="FileSystemC__Skeleton" />
            </>
        ) : (
            <div
                className="FileSystemC__Main"
                onClick={() => this.handleClick()}
            >
                <List className="FileSystemC__List">
                    {this.state.fs.contents.map((value) =>
                        value.type == "folder" ? (
                            <FolderC
                                key={value.name}
                                filePath={value.name}
                                folder={value}
                                onNewFile={(filePath) =>
                                    this.handleCreateFile(filePath)
                                }
                                onNewFolder={(filePath) =>
                                    this.handleCreateFolder(filePath)
                                }
                                onRename={(filePath) =>
                                    this.handleRename(filePath)
                                }
                                onDelete={(filePath) =>
                                    this.handleDelete(filePath)
                                }
                                onRename={(filePath) =>
                                    this.handleRename(filePath)
                                }
                                onDelete={(filePath) =>
                                    this.handleDelete(filePath)
                                }
                            />
                        ) : (
                            <FileC
                                key={value.name}
                                filePath={value.name}
                                name={value.name}
                            />
                        )
                    )}
                </List>
                <div className="FileSystemC__TextFieldHolder">
                    <TextField
                        onKeyUp={(event) => this.handleKeyUp(event)}
                        onChange={(event) => this.handleChange(event)}
                        key="FileSystemC__TextField"
                        className={classNames({
                            FileSystemC__TextField: true,
                            "FileSystemC__TextField--Active": this.state.input
                                .isActive,
                        })}
                        label={this.state.input.label}
                        color="primary"
                        inputRef={this.inputRef}
                        value={this.state.input.value}
                        helperText={this.state.input.helperText}
                        error={this.state.input.hasError}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<FileSystemC />, document.querySelector("#FileSystem"));
