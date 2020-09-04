"use strict";

import React, { createRef, useState, useEffect } from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/react-dom` if it exists or... Remove this comment to see the full error message
import ReactDOM from "react-dom";
import QuillC, { Quill } from "react-quill";
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/classnames` if it exists o... Remove this comment to see the full error message
import classNames from "classnames";

// @ts-expect-error ts-migrate(6142) FIXME: Module './Topbar.jsx' was resolved to '/home/kevin... Remove this comment to see the full error message
import Topbar from "./Topbar.jsx";

export default (props: any) => {
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

    function handleChange(change: any, filePath: any) {
        if (props.fs === null) return;
        props.onUpdateFs("update", props.fs.activeFilePath, change);
    }

    function handleChangeSelection(newRange: any, filePath: any) {
        if (props.fs === null) return;
        props.onUpdateFs("updateSelection", props.fs.activeFilePath, newRange);
    }

    function handleKeyUp(event: any) {
        if (event.key == "Enter") {
            if (props.fs.activeFileName == event.target.value) {
                // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
                renamerRef.current.blur();
            } else if (props.fs.activeFolder.get(event.target.value)) {
                changeRenamerError({
                    hasError: true,
                    helperText: "This name is already used.",
                });
                // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
                renamerRef.current.focus();
            } else {
                props.onRename(event.target.value);
                changeRenamerError({ hasError: false, helperText: "" });
                // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
                renamerRef.current.blur();
            }
        }
    }

    function handleRenamerBlur(event: any) {
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
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Topbar
                fileName={fileName}
                onOpenFileSystem={() => props.onOpenFileSystem()}
                onChange={changeFileName}
                onKeyUp={handleKeyUp}
                inputRef={renamerRef}
                renamerError={renamerError}
                onRenamerBlur={handleRenamerBlur}
            />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
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
