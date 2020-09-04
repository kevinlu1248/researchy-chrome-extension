"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Frame from "react-frame-component";

import Sidebar from "./Sidebar.jsx";

function SidebarIframe(props) {
    return (
        <Frame id="researchySidebar" className={"my-extension"}>
            <Sidebar />
        </Frame>
    );
}

const app = document.createElement("div");
app.id = "researchyRoot";
document.body.appendChild(app);
ReactDOM.render(<SidebarIframe />, app);
