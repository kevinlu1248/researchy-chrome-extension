"use strict";

import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import Skeleton from "@material-ui/lab/Skeleton";
import TextField from "@material-ui/core/TextField";

import Topbar from "./Topbar.jsx";
import FileC from "./FileC.tsx";
import FolderC from "./FolderC.jsx";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.jsx";

/*
Components have names {}C since their corresponding name have already
been taken, but this does not apply for the class names
*/

export default class FileSystemC extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.focusInput = this.focusInput.bind(this);
        this.state = {
            isActive: false,
            fs: this.props.fs,
            input: {
                label: "Create New File:",
                isActive: false,
                helperText: "",
                hasError: false,
                value: "",
            },
            dialog: {
                isOpen: false,
                filePath: "",
            },
        };
    }

    focusInput() {
        this.inputRef.focus();
    }

    handleChange(event) {
        const input = this.state.input;
        input.value = event.target.value;
        this.setState({ input: input });
    }

    handleClick() {
        this.setState({ input: { value: "", isActive: false } });
    }

    handleToggleOpen(filePath, isOpen) {
        this.props.onUpdateFs("toggleOpen", filePath, !isOpen);
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
        this.modifyingPath = filePath;
        this.setState({
            modifyingPath: filePath,
            dialog: { isOpen: true, filePath: filePath },
        });
    }

    handleCancel() {
        this.setState({ dialog: { isOpen: false } });
    }

    handleConfirmDelete() {
        this.props.onDelete(this.modifyingPath);
        this.setState({ dialog: { isOpen: false } });
    }

    handleKeyUp(event) {
        if (event.key == "Enter") {
            const fs = this.props.fs;
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
                        this.props.onUpdateFs(
                            "newFile",
                            this.modifyingPath,
                            event.target.value
                        );
                        break;
                    case "createFolder":
                        this.props.onUpdateFs(
                            "newFolder",
                            this.modifyingPath,
                            event.target.value
                        );
                        break;
                    case "rename":
                        this.props.onUpdateFs(
                            "rename",
                            this.modifyingPath,
                            event.target.value
                        );
                        break;
                }
                this.setState({
                    input: { value: "", isActive: false },
                });
            }
        }
    }

    render() {
        return this.props.fs === null ? (
            <div
                className={classNames({
                    FileSystemC__Main: true,
                    "FileSystemC__Main--Active": this.props.isActive,
                })}
            >
                <Topbar
                    disabled={true}
                    onCloseFileSystem={() => this.props.onCloseFileSystem()}
                />
                <Skeleton className="FileSystemC__Skeleton FileSystemC__Skeleton--First" />
                <Skeleton className="FileSystemC__Skeleton" />
                <Skeleton className="FileSystemC__Skeleton" />
            </div>
        ) : (
            <div
                onClick={() => this.handleClick()}
                className={classNames({
                    FileSystemC__Main: true,
                    "FileSystemC__Main--Active": this.props.isActive,
                })}
            >
                <Topbar
                    disabled={false}
                    onCreateFile={() => this.handleCreateFile("")}
                    onCreateFolder={() => this.handleCreateFolder("")}
                    onCloseFileSystem={() => this.props.onCloseFileSystem()}
                />
                <List className="FileSystemC__List">
                    {this.props.fs.contents.map((value) =>
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
                                isOpen={value.isOpen}
                                onToggleOpen={(filePath, isOpen) =>
                                    this.handleToggleOpen(filePath, isOpen)
                                }
                                onActivateFile={(filePath) =>
                                    this.props.onActivateFile(filePath)
                                }
                            />
                        ) : (
                            <FileC
                                key={value.name}
                                filePath={value.name}
                                file={value}
                                onRename={(filePath) =>
                                    this.handleRename(filePath)
                                }
                                onDelete={(filePath) =>
                                    this.handleDelete(filePath)
                                }
                                onActivateFile={(filePath) =>
                                    this.props.onActivateFile(filePath)
                                }
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
                <ConfirmDeleteDialog
                    isOpen={this.state.dialog.isOpen}
                    filePath={this.modifyingPath}
                    onCancel={() => this.handleCancel()}
                    onConfirmDelete={() => this.handleConfirmDelete()}
                />
            </div>
        );
    }
}
