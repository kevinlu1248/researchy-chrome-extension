"use strict";

import React from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/react-dom` if it exists or... Remove this comment to see the full error message
import ReactDOM from "react-dom";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/classnames` if it exists o... Remove this comment to see the full error message
import classNames from "classnames";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import Skeleton from "@material-ui/lab/Skeleton";
import TextField from "@material-ui/core/TextField";

// @ts-expect-error ts-migrate(6142) FIXME: Module './Topbar.jsx' was resolved to '/home/kevin... Remove this comment to see the full error message
import Topbar from "./Topbar.jsx";
// @ts-expect-error ts-migrate(6142) FIXME: Module './FileC.jsx' was resolved to '/home/kevin/... Remove this comment to see the full error message
import FileC from "./FileC.jsx";
// @ts-expect-error ts-migrate(6142) FIXME: Module './FolderC.jsx' was resolved to '/home/kevi... Remove this comment to see the full error message
import FolderC from "./FolderC.jsx";
// @ts-expect-error ts-migrate(6142) FIXME: Module './ConfirmDeleteDialog.jsx' was resolved to... Remove this comment to see the full error message
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.jsx";

type State = any;

/*
Components have names {}C since their corresponding name have already
been taken, but this does not apply for the class names
*/

export default class FileSystemC extends React.Component<{}, State> {
    inputRef: any;
    modifyMode: any;
    modifyingPath: any;
    constructor(props: {}) {
        super(props);
        this.inputRef = React.createRef();
        this.focusInput = this.focusInput.bind(this);
        this.state = {
            isActive: false,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'fs' does not exist on type 'Readonly<{}>... Remove this comment to see the full error message
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

    handleChange(event: any) {
        const input = this.state.input;
        input.value = event.target.value;
        this.setState({ input: input });
    }

    handleClick() {
        this.setState({ input: { value: "", isActive: false } });
    }

    handleToggleOpen(filePath: any, isOpen: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onUpdateFs' does not exist on type 'Read... Remove this comment to see the full error message
        this.props.onUpdateFs("toggleOpen", filePath, !isOpen);
    }

    handleCreateFile(filePath: any) {
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

    handleCreateFolder(filePath: any) {
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

    handleRename(filePath: any) {
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

    handleDelete(filePath: any) {
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onDelete' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.onDelete(this.modifyingPath);
        this.setState({ dialog: { isOpen: false } });
    }

    handleKeyUp(event: any) {
        if (event.key == "Enter") {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'fs' does not exist on type 'Readonly<{}>... Remove this comment to see the full error message
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
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onUpdateFs' does not exist on type 'Read... Remove this comment to see the full error message
                        this.props.onUpdateFs(
                            "newFile",
                            this.modifyingPath,
                            event.target.value
                        );
                        break;
                    case "createFolder":
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onUpdateFs' does not exist on type 'Read... Remove this comment to see the full error message
                        this.props.onUpdateFs(
                            "newFolder",
                            this.modifyingPath,
                            event.target.value
                        );
                        break;
                    case "rename":
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onUpdateFs' does not exist on type 'Read... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'fs' does not exist on type 'Readonly<{}>... Remove this comment to see the full error message
        return this.props.fs === null ? (
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div
                className={classNames({
                    FileSystemC__Main: true,
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isActive' does not exist on type 'Readon... Remove this comment to see the full error message
                    "FileSystemC__Main--Active": this.props.isActive,
                })}
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Topbar
                    disabled={true}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onCloseFileSystem' does not exist on typ... Remove this comment to see the full error message
                    onCloseFileSystem={() => this.props.onCloseFileSystem()}
                />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Skeleton className="FileSystemC__Skeleton FileSystemC__Skeleton--First" />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Skeleton className="FileSystemC__Skeleton" />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Skeleton className="FileSystemC__Skeleton" />
            </div>
        ) : (
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div
                onClick={() => this.handleClick()}
                className={classNames({
                    FileSystemC__Main: true,
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isActive' does not exist on type 'Readon... Remove this comment to see the full error message
                    "FileSystemC__Main--Active": this.props.isActive,
                })}
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Topbar
                    disabled={false}
                    onCreateFile={() => this.handleCreateFile("")}
                    onCreateFolder={() => this.handleCreateFolder("")}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onCloseFileSystem' does not exist on typ... Remove this comment to see the full error message
                    onCloseFileSystem={() => this.props.onCloseFileSystem()}
                />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <List className="FileSystemC__List">
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'fs' does not exist on type 'Readonly<{}>... Remove this comment to see the full error message */}
                    {this.props.fs.contents.map((value: any) => value.type == "folder" ? (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <FolderC
                            key={value.name}
                            filePath={value.name}
                            folder={value}
                            onNewFile={(filePath: any) => this.handleCreateFile(filePath)
                            }
                            onNewFolder={(filePath: any) => this.handleCreateFolder(filePath)
                            }
                            onRename={(filePath: any) => this.handleRename(filePath)
                            }
                            onDelete={(filePath: any) => this.handleDelete(filePath)
                            }
                            isOpen={value.isOpen}
                            onToggleOpen={(filePath: any, isOpen: any) =>
                                this.handleToggleOpen(filePath, isOpen)
                            }
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'onActivateFile' does not exist on type '... Remove this comment to see the full error message
                            onActivateFile={(filePath: any) => this.props.onActivateFile(filePath)
                            }
                        />
                    ) : (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <FileC
                            key={value.name}
                            filePath={value.name}
                            file={value}
                            onRename={(filePath: any) => this.handleRename(filePath)
                            }
                            onDelete={(filePath: any) => this.handleDelete(filePath)
                            }
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'onActivateFile' does not exist on type '... Remove this comment to see the full error message
                            onActivateFile={(filePath: any) => this.props.onActivateFile(filePath)
                            }
                        />
                    )
                    )}
                </List>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className="FileSystemC__TextFieldHolder">
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
