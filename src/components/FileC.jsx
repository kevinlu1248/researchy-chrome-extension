import React from "react";

import EditIcon from "@material-ui/icons/Edit";
import NotesIcon from "@material-ui/icons/Notes";
import DeleteIcon from "@material-ui/icons/Delete";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

export default function FileC(props) {
    return (
        <ListItem
            className="File__Header" // fileItem waves-effect waves-blue btn-flat file-folder-item
            path={props.file.path}
            button
        >
            <ListItemIcon>
                <NotesIcon />
            </ListItemIcon>
            <ListItemText className="File__HeaderText">
                {props.file.name}
            </ListItemText>
            <Button className="FileC__Button" disableElevation>
                <EditIcon />
            </Button>
            <Button className="FileC__Button" disableElevation>
                <DeleteIcon />
            </Button>
        </ListItem>
    );
}
