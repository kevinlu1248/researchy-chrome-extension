import React from "react";

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";

import FileC from "./FileC.jsx";

export default class FolderC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folder: this.props.folder,
            filePath: this.props.filePath,
            isOpen: this.props.folder.isOpen,
        };
    }

    render() {
        return (
            <>
                <ListItem
                    className="Folder__Header"
                    onClick={() =>
                        this.setState({ isOpen: !this.state.isOpen })
                    }
                    button
                >
                    <ListItemIcon>
                        {this.state.isOpen ? (
                            <FolderOpenIcon />
                        ) : (
                            <FolderIcon />
                        )}
                    </ListItemIcon>
                    <ListItemText className="FolderC__HeaderText">
                        {this.state.folder.name}
                    </ListItemText>
                    <Button
                        className="FolderC__Button"
                        disableElevation
                        onClick={(e) => {
                            this.props.onNewFile(this.props.filePath);
                            e.stopPropagation();
                        }}
                    >
                        <AddIcon />
                    </Button>
                    <Button
                        className="FolderC__Button"
                        disableElevation
                        onClick={(e) => {
                            this.props.onNewFolder(this.props.filePath);
                            e.stopPropagation();
                        }}
                    >
                        <CreateNewFolderIcon />
                    </Button>
                    <Button
                        className="FolderC__Button"
                        disableElevation
                        onClick={(e) => {
                            this.props.onRename(this.props.filePath);
                            e.stopPropagation();
                        }}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        className="FolderC__Button"
                        onClick={(e) => {
                            this.props.onDelete(this.props.filePath);
                            e.stopPropagation();
                        }}
                        disableElevation
                    >
                        <DeleteIcon />
                    </Button>
                </ListItem>
                <Collapse in={this.state.isOpen}>
                    <List className="Folder__List">
                        {this.state.folder.contents.map((value, index) =>
                            value.type == "folder" ? (
                                <FolderC
                                    key={value.name}
                                    filePath={
                                        this.state.filePath + "/" + value.name
                                    }
                                    folder={value}
                                    onNewFile={(filePath) =>
                                        this.props.onCreateFile(filePath)
                                    }
                                    onNewFolder={(filePath) =>
                                        this.props.onCreateFolder(filePath)
                                    }
                                    onRename={(filePath) =>
                                        this.props.onRename(filePath)
                                    }
                                    onDelete={(filePath) =>
                                        this.props.onDelete(filePath)
                                    }
                                />
                            ) : (
                                <FileC
                                    key={value.name}
                                    filePath={
                                        this.state.filePath + "/" + value.name
                                    }
                                    file={value}
                                />
                            )
                        )}
                    </List>
                </Collapse>
            </>
        );
    }
}
