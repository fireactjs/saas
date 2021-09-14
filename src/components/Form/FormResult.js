import React from "react";
import PropTypes from "prop-types";
import { Alert } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import ButtonRow from "./ButtonRow";

const FormResult = (props) => {
    const {
        severity,
        resultMessage,
        primaryText,
        primaryAction,
        secondaryText,
        secondaryAction
    } = props;

    return (
        <>
            <Alert severity={severity}>{resultMessage}</Alert>
            <ButtonRow>
                <Button variant="contained" color="primary" onClick={primaryAction} >{primaryText}</Button>
                {secondaryText && <Button variant="contained" onClick={secondaryAction}>{secondaryText}</Button>}
            </ButtonRow>
        </>
    );
}

FormResult.propTypes = {
    severity: PropTypes.string,
    resultMessage: PropTypes.string,
    primaryText: PropTypes.string,
    primaryAction: PropTypes.func,
    secondaryText: PropTypes.string,
    secondaryAction: PropTypes.func
}

export default FormResult;