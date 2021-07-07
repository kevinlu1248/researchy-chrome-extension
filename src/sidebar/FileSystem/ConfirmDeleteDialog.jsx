"use strict";

import React, { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export default function ConfirmDeleteDialog(props) {
    // const [isOpen, setIsOpen] = useState(props.isOpen);
    return (
        <Dialog
            open={props.isOpen}
            onClose={(event) => console.log(event)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you would like to delete "{props.filePath}"?
                    This cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color="primary" autoFocus>
                    No
                </Button>
                <Button onClick={props.onConfirmDelete} color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
