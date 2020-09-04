"use strict";

import React, { createRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import QuillC, { Quill } from "react-quill";
import classNames from "classnames";

import Topbar from "./Topbar.jsx";

export default (props) => {
    const renamerRef = createRef();
    const [fileName, changeFileName] = useState(
        props.fs === null ? "" : props.fs.activeFileName
    );
    const [renamerError, changeRenamerError] = useState({
        hasError: false,
        helperText: "",
    });

    useEffect(() => {
        changeFileName(props.fs === null ? "" : props.fs.activeFileName);
    }, [props.fs]);

    function handleChange(change, filePath) {
        if (props.fs === null) return;
        props.onUpdateFs("update", props.fs.activeFilePath, change);
    }

    function handleChangeSelection(newRange, filePath) {
        if (props.fs === null) return;
        props.onUpdateFs("updateSelection", props.fs.activeFilePath, newRange);
    }

    function handleKeyUp(event) {
        if (event.key == "Enter") {
            if (props.fs.activeFileName == event.target.value) {
                renamerRef.current.blur();
            } else if (props.fs.activeFolder.get(event.target.value)) {
                changeRenamerError({
                    hasError: true,
                    helperText: "This name is already used.",
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
            [{ color: [] }, { background: [] }],
        ],
    };

    return (
        <div>
            <Topbar
                fileName={fileName}
                onOpenFileSystem={() => props.onOpenFileSystem()}
                onChange={changeFileName}
                onKeyUp={handleKeyUp}
                inputRef={renamerRef}
                renamerError={renamerError}
                onRenamerBlur={handleRenamerBlur}
            />
            <QuillC
                theme="snow"
                value={props.fs === null ? "" : props.fs.activeFile.delta}
                onChange={(newHtml, partial) =>
                    handleChange(
                        partial,
                        props.fs === null ? null : props.fs.activeFilePath
                    )
                }
                onChangeSelection={(newRange) =>
                    handleChangeSelection(
                        newRange,
                        props.fs === null ? null : props.fs.activeFilePath
                    )
                }
                modules={modules}
                ref={props.editorRef}
            />
        </div>
    );
};
