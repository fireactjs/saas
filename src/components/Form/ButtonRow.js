import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
}));

const ButtonRow = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {children}
        </div>
    );
}

export default ButtonRow;