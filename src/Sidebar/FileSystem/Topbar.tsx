"use strict";

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    root: {
        padding: "0 1rem",
        paddingTop: "1rem",
        "& .Topbar__Title": {
            flexGrow: 1,
            paddingLeft: "1rem",
        },
    },
});

export default function Topbar(props: any) {
    const classes = useStyles();
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Grid
            className={classes.root}
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button
                className="Topbar__Button"
                onClick={(event) => {
                    props.onCreateFile();
                    event.stopPropagation();
                }}
                disableElevation
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <AddIcon />
            </Button>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button
                className="Topbar__Button"
                onClick={(event) => {
                    props.onCreateFolder();
                    event.stopPropagation();
                }}
                disableElevation
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CreateNewFolderIcon />
            </Button>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Typography className="Topbar__Title">Notes</Typography>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Button
                className="Topbar__Button Topbar__BackButton"
                onClick={(event) => props.onCloseFileSystem()}
                disableElevation
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ArrowLeftIcon />
            </Button>
        </Grid>
    );
}
/*
<div id="topbar">
    <span>
        <a
            class="dropdown-trigger waves-effect waves-blue btn-flat"
            href="#"
            data-target="addItem"
            ><i class="material-icons">more_vert</i></a
        >

        <ul id="addItem" class="dropdown-content">
            <li>
                <a class="file-folder-action"
                    ><i class="material-icons">add</i></a
                >
            </li>
            <li>
                <a class="file-folder-action"
                    ><i class="material-icons"
                        >create_new_folder</i
                    ></a
                >
            </li>
        </ul>
    </span>

    <div
        class="input-field inline"
        style="margin: auto; flex-grow: 1; width: auto;"
    >
        Notes
    </div>

    <a
        id="deactivateFileSystem"
        class="waves-effect waves-blue btn-flat"
    >
        <i class="material-icons">chevron_left</i>
    </a>
</div>*/
