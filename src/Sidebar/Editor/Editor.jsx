"use strict";

import React, { createRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import QuillC, { Quill } from "react-quill";
import classNames from "classnames";

import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";

import Topbar from "./Topbar.jsx";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        "& .Editor__Quill--Active .ql-editor": {
            padding: 0
        },
        "& .Editor__Quill--Inactive .ql-editor": {
            height: 0
        },
        "& .Editor__Skeletons": {
            flexGrow: 1
        }
    }
});

export default (props) => {
    const classes = useStyles();
    const renamerRef = createRef();
    const [fileName, changeFileName] = useState(
        props.fs === null ? "" : props.fs.activeFileName
    );
    const [renamerError, changeRenamerError] = useState({
        hasError: false,
        helperText: ""
    });

    useEffect(() => {
        changeFileName(props.fs === null ? "" : props.fs.activeFileName);
    }, [props.fs]);

    function handleChange(change, filePath, source) {
        if (props.fs === null) return;
        console.log(change, source);
        if (source === "user")
            props.onUpdateFs("update", props.fs.activeFilePath, change);
    }

    function handleChangeSelection(newRange, filePath, source) {
        if (props.fs === null) return;
        if (source === "user")
            props.onUpdateFs(
                "updateSelection",
                props.fs.activeFilePath,
                newRange
            );
    }

    function handleKeyUp(event) {
        if (event.key == "Enter") {
            if (props.fs.activeFileName == event.target.value) {
                renamerRef.current.blur();
            } else if (props.fs.activeFolder.get(event.target.value)) {
                changeRenamerError({
                    hasError: true,
                    helperText: "This name is already used."
                });
                renamerRef.current.focus();
            } else {
                props.onRename(event.target.value);
                changeRenamerError({ hasError: false, helperText: "" });
                renamerRef.current.blur();
            }
        }
    }

    function handleRenamerBlur(event) {
        handleKeyUp({ key: "Enter", target: { value: event.target.value } });
    }

    const modules = {
        toolbar: [
            [{ header: 1 }, { header: 2 }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block", "formula"],
            ["link", "image", "video"],
            [{ color: [] }, { background: [] }]
        ]
    };

    return (
        <div className={classes.root}>
            <Topbar
                fileName={fileName}
                onOpenFileSystem={() => props.onOpenFileSystem()}
                onChange={changeFileName}
                onKeyUp={handleKeyUp}
                inputRef={renamerRef}
                renamerError={renamerError}
                onRenamerBlur={handleRenamerBlur}
            />

            {props.fs ? (
                <QuillC
                    theme="snow"
                    className="
                    Editor__Quill--Active
                    "
                    value={props.fs.activeFile.delta}
                    onChange={(newHtml, partial, source) =>
                        handleChange(partial, props.fs.activeFilePath, source)
                    }
                    onChangeSelection={(newRange, source) =>
                        handleChangeSelection(
                            newRange,
                            props.fs.activeFilePath,
                            source
                        )
                    }
                    modules={modules}
                    ref={props.editorRef}
                />
            ) : (
                <>
                    <QuillC
                        theme="snow"
                        className="Editor__Quill--Inactive"
                        modules={modules}
                        readOnly={true}
                    />
                    <div className="Editor__Skeletons">
                        <Typography variant="h2">
                            <Skeleton />
                        </Typography>
                        <Typography variant="p">
                            <Skeleton />
                        </Typography>
                        <Typography variant="p">
                            <Skeleton />
                        </Typography>
                    </div>
                </>
            )}
        </div>
    );
};
