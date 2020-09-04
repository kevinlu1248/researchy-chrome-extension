"use strict";

import React, { useState, useEffect } from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/react-dom` if it exists or... Remove this comment to see the full error message
import ReactDOM from "react-dom";
import Quill from "react-quill";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/classnames` if it exists o... Remove this comment to see the full error message
import classNames from "classnames";

import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import MenuIcon from "@material-ui/icons/Menu";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function EditorTopBar(props: any) {
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Box display="flex">
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button disabled={props.disabled} onClick={props.onOpenFileSystem}>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <MenuIcon />
            </Button>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button disabled={props.disabled}>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ArrowLeftIcon />
            </Button>
        </Box>
    );
}
