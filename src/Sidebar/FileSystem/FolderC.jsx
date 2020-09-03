"use strict";

import React, { useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";

import FileC from "./FileC.jsx";

export default function FolderC(props) {
    const [folder, setFolder] = useState(props.folder);

    return (
        <>
            <ListItem
                className="Folder__Header"
                onClick={() => props.onToggleOpen(props.filePath, props.isOpen)}
                button
            >
                <ListItemIcon>
                    {props.isOpen ? <FolderOpenIcon /> : <FolderIcon />}
                </ListItemIcon>
                <ListItemText className="FolderC__HeaderText">
                    {folder.name}
                </ListItemText>
                <Button
                    className="FolderC__Button"
                    disableElevation
                    onClick={(e) => {
                        props.onNewFile(props.filePath);
                        e.stopPropagation();
                    }}
                >
                    <AddIcon />
                </Button>
                <Button
                    className="FolderC__Button"
                    disableElevation
                    onClick={(e) => {
                        props.onNewFolder(props.filePath);
                        e.stopPropagation();
                    }}
                >
                    <CreateNewFolderIcon />
                </Button>
                <Button
                    className="FolderC__Button"
                    disableElevation
                    onClick={(e) => {
                        props.onRename(props.filePath);
                        e.stopPropagation();
                    }}
                >
                    <EditIcon />
                </Button>
                <Button
                    className="FolderC__Button"
                    onClick={(e) => {
                        props.onDelete(props.filePath);
                        e.stopPropagation();
                    }}
                    disableElevation
                >
                    <DeleteIcon />
                </Button>
            </ListItem>
            <Collapse in={props.isOpen}>
                <List className="Folder__List">
                    {folder.contents.map((value, index) =>
                        value.type == "folder" ? (
                            <FolderC
                                key={value.name}
                                filePath={props.filePath + "/" + value.name}
                                folder={value}
                                onNewFile={(filePath) =>
                                    props.onNewFile(filePath)
                                }
                                onNewFolder={(filePath) =>
                                    props.onNewFolder(filePath)
                                }
                                onRename={(filePath) =>
                                    props.onRename(filePath)
                                }
                                onDelete={(filePath) =>
                                    props.onDelete(filePath)
                                }
                                onToggleOpen={(filePath, isOpen) =>
                                    props.onToggleOpen(filePath, isOpen)
                                }
                                isOpen={value.isOpen}
                                onActivateFile={(filePath) =>
                                    props.onActivateFile(filePath)
                                }
                            />
                        ) : (
                            <FileC
                                key={value.name}
                                filePath={props.filePath + "/" + value.name}
                                file={value}
                                onRename={(filePath) =>
                                    props.onRename(filePath)
                                }
                                onDelete={(filePath) =>
                                    props.onDelete(filePath)
                                }
                                onActivateFile={(filePath) =>
                                    props.onActivateFile(filePath)
                                }
                            />
                        )
                    )}
                </List>
            </Collapse>
        </>
    );
}
