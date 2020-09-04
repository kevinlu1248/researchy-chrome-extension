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

// @ts-expect-error ts-migrate(6142) FIXME: Module './FileC.jsx' was resolved to '/home/kevin/... Remove this comment to see the full error message
import FileC from "./FileC.jsx";

export default function FolderC(props: any) {
    const [folder, setFolder] = useState(props.folder);

    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ListItem
            className="Folder__Header"
            onClick={() => props.onToggleOpen(props.filePath, props.isOpen)}
            button
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ListItemIcon>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                {props.isOpen ? <FolderOpenIcon /> : <FolderIcon />}
            </ListItemIcon>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ListItemText className="FolderC__HeaderText">
                {folder.name}
            </ListItemText>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button
                className="FolderC__Button"
                disableElevation
                onClick={(e) => {
                    props.onNewFile(props.filePath);
                    e.stopPropagation();
                }}
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <AddIcon />
            </Button>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button
                className="FolderC__Button"
                disableElevation
                onClick={(e) => {
                    props.onNewFolder(props.filePath);
                    e.stopPropagation();
                }}
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CreateNewFolderIcon />
            </Button>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button
                className="FolderC__Button"
                disableElevation
                onClick={(e) => {
                    props.onRename(props.filePath);
                    e.stopPropagation();
                }}
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <EditIcon />
            </Button>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button
                className="FolderC__Button"
                onClick={(e) => {
                    props.onDelete(props.filePath);
                    e.stopPropagation();
                }}
                disableElevation
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <DeleteIcon />
            </Button>
        </ListItem>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Collapse in={props.isOpen}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <List className="Folder__List">
                {folder.contents.map((value: any, index: any) =>
                    value.type == "folder" ? (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <FolderC
                            key={value.name}
                            filePath={props.filePath + "/" + value.name}
                            folder={value}
                            onNewFile={(filePath: any) => props.onNewFile(filePath)
                            }
                            onNewFolder={(filePath: any) => props.onNewFolder(filePath)
                            }
                            onRename={(filePath: any) => props.onRename(filePath)
                            }
                            onDelete={(filePath: any) => props.onDelete(filePath)
                            }
                            onToggleOpen={(filePath: any, isOpen: any) =>
                                props.onToggleOpen(filePath, isOpen)
                            }
                            isOpen={value.isOpen}
                            onActivateFile={(filePath: any) => props.onActivateFile(filePath)
                            }
                        />
                    ) : (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <FileC
                            key={value.name}
                            filePath={props.filePath + "/" + value.name}
                            file={value}
                            onRename={(filePath: any) => props.onRename(filePath)
                            }
                            onDelete={(filePath: any) => props.onDelete(filePath)
                            }
                            onActivateFile={(filePath: any) => props.onActivateFile(filePath)
                            }
                        />
                    )
                )}
            </List>
        </Collapse>
    </>;
}
