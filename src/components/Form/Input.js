import React, { useState } from "react";
import PropTypes from "prop-types";

const Input = (props) => {

    const {
        hasError,
        validRegex,
        ...others
    } = props;

    const [hasErrorState, setHasErrorState] = useState(hasError||false);
    const [errorMessage, setErrorMessage] = useState(props.error);

    return (
        <>
            <input className={"form-control"+(hasErrorState?' is-invalid':'')} {...others} onBlur={(e) => {
                // validate the value against validation regex
                if(props.validRegex !== null && props.validRegex !== ''){
                    if(RegExp(props.validRegex).test(e.target.value)){
                        setHasErrorState(false);
                    }else{
                        setErrorMessage('Invalid format.')
                        setHasErrorState(true);
                    }
                }
            }} />
            {hasErrorState && 
                <div className="invalid-feedback">
                    {errorMessage}
                </div>
            }
        </>
    )
}

Input.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    validRegex: PropTypes.string,
    hasError: PropTypes.bool
}

export default Input;