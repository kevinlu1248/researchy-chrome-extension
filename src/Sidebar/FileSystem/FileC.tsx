"use strict";

import React from "react";

import EditIcon from "@material-ui/icons/Edit";
import NotesIcon from "@material-ui/icons/Notes";
import DeleteIcon from "@material-ui/icons/Delete";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
export default (props: any) => (
    <ListItem
        className="File__Header" // fileItem waves-effect waves-blue btn-flat file-folder-item
        onClick={() => props.onActivateFile(props.filePath)}
        button
    >
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ListItemIcon>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <NotesIcon />
        </ListItemIcon>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ListItemText className="File__HeaderText">
            {props.file.name}
        </ListItemText>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Button
            className="FileC__Button"
            onClick={(event) => {
                props.onRename(props.filePath);
                event.stopPropagation();
            }}
            disableElevation
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <EditIcon />
        </Button>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Button
            className="FileC__Button"
            onClick={(event) => {
                props.onDelete(props.filePath);
                event.stopPropagation();
            }}
            disableElevation
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DeleteIcon />
        </Button>
    </ListItem>
);
