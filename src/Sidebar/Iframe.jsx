"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Frame, { FrameContextConsumer } from "react-frame-component";

import Sidebar from "./Sidebar.jsx";

function SidebarIframe(props) {
    return (
        <Frame
            id="researchySidebar"
            className={"my-extension"}
            head={[
                <>
                    <link
                        type="text/css"
                        rel="stylesheet"
                        href={chrome.runtime.getURL("/static/css/sidebar.css")}
                    ></link>
                    <link
                        type="text/css"
                        rel="stylesheet"
                        href={chrome.runtime.getURL(
                            "/static/css/FileSystem.css"
                        )}
                    ></link>
                    <link
                        type="text/css"
                        rel="stylesheet"
                        href={chrome.runtime.getURL(
                            "/static/css/sidebarRelated.css"
                        )}
                    ></link>
                </>
            ]}
        >
            <FrameContextConsumer>
                <Sidebar />
            </FrameContextConsumer>
        </Frame>
    );
}

// const app = document.createElement("iframe");
// app.id = "researchySidebar";
// document.appendChild(app);
// const app = document.getElementById("researchySidebar");
// console.log(app);
ReactDOM.render(<SidebarIframe />, app);
