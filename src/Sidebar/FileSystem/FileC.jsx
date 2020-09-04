"use strict";

import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import NotesIcon from "@material-ui/icons/Notes";
import DeleteIcon from "@material-ui/icons/Delete";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

export default (props) => (
    <ListItem
        className="File__Header" // fileItem waves-effect waves-blue btn-flat file-folder-item
        onClick={() => props.onActivateFile(props.filePath)}
        button
    >
        <ListItemIcon>
            <NotesIcon />
        </ListItemIcon>
        <ListItemText className="File__HeaderText">
            {props.file.name}
        </ListItemText>
        <Button
            className="FileC__Button"
            onClick={(event) => {
                props.onRename(props.filePath);
                event.stopPropagation();
            }}
            disableElevation
        >
            <EditIcon />
        </Button>
        <Button
            className="FileC__Button"
            onClick={(event) => {
                props.onDelete(props.filePath);
                event.stopPropagation();
            }}
            disableElevation
        >
            <DeleteIcon />
        </Button>
    </ListItem>
);
