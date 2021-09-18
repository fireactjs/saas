import React from "react";
import PropTypes from "prop-types";
import { useHistory } from 'react-router-dom';
import Loader from '../Loader';
import { Button } from "@mui/material";
import ButtonRow from "./ButtonRow";

const Form = (props) => {
    const history = useHistory();

    const {
        handleSubmit,
        disabled,
        inSubmit,
        enableDefaultButtons,
        submitBtnStyle,
        submitBtnText,
        backBtnText,
        backToUrl,
        children,
        ...others} = props;

    let btnClass = "primary";
    if(submitBtnStyle){
        btnClass = submitBtnStyle;
    }

    return (
        <form {...others} onSubmit={(e) => e.preventDefault()}>
            {children}
            {enableDefaultButtons && 
                <ButtonRow>
                    <Button variant="contained" color={btnClass} disabled={disabled} onClick={handleSubmit}>
                        {inSubmit && 
                            <Loader />
                        }
                        {submitBtnText || 'Submit'}
                    </Button>
                    {backToUrl && backToUrl !== "" &&
                        <Button variant="contained" color="secondary" disabled={inSubmit} onClick={(e) => {
                            e.preventDefault();
                            history.push(backToUrl);
                        }}>
                            {backBtnText || 'Back'}
                        </Button>
                    }
                </ButtonRow>
            }
        </form>
    )
}

Form.propTypes = {
    handleSubmit: PropTypes.func,
    disabled: PropTypes.bool,
    inSubmit: PropTypes.bool,
    enableDefaultButtons: PropTypes.bool,
    submitBtnText: PropTypes.string,
    backBtnText: PropTypes.string,
    backToUrl: PropTypes.string
}

export default Form;