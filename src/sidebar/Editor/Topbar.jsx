"use strict";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Quill from "react-quill";
import classNames from "classnames";

import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import MenuIcon from "@material-ui/icons/Menu";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function EditorTopBar(props) {
    function closeSidebar() {
        chrome.runtime.sendMessage({ researchyAction: "closeSidebar" });
    }
    return (
        <Box className="EditorTopBar__Box" display="flex">
            <Button
                className="EditorTopBar__Button"
                disabled={props.disabled}
                onClick={props.onOpenFileSystem}
            >
                <MenuIcon />
            </Button>
            <TextField
                value={props.fileName}
                onChange={(event) => props.onChange(event.target.value)}
                onKeyUp={(event) => props.onKeyUp(event)}
                className="EditorTopBar__TextField"
                inputRef={props.inputRef}
                error={props.renamerError.hasError}
                helperText={props.renamerError.helperText}
                inputProps={{ onBlur: props.onRenamerBlur }}
            />
            <Button
                className="EditorTopBar__Button"
                disabled={props.disabled}
                onClick={closeSidebar}
            >
                <ArrowLeftIcon />
            </Button>
        </Box>
    );
}
