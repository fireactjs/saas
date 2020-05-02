import React, { useState } from "react";
import PropTypes from "prop-types";

const Input = (props) => {

    const {
        hasError,
        validRegex,
        minLen,
        maxLen,
        required,
        error,
        changeHandler,
        ...others
    } = props;

    const [hasErrorState, setHasErrorState] = useState(hasError||false);
    const [errorMessage, setErrorMessage] = useState(props.error);

    return (
        <>
            <input className={"form-control"+(hasErrorState?' is-invalid':'')} {...others} onChange={e => {
                let foundError = false;
                // validae required
                if(typeof(required) !== 'undefined' && required){
                    if(e.target.value.trim().length === 0){
                        setErrorMessage('This is a required field.');
                        foundError = true;
                    }
                }

                // validate length
                if(!foundError && typeof(minLen) !== 'undefined' && minLen !== 0){
                    if(e.target.value.length < minLen){
                        setErrorMessage('The input must be at least '+minLen+' characters.');
                        foundError = true;
                    }
                }
                if(!foundError && typeof(maxLen) !== 'undefined' && maxLen !== 0){
                    if(e.target.value.length > maxLen){
                        setErrorMessage('The input must be no more than '+maxLen+' characters.');
                        foundError = true;
                    }
                }
                
                // validate the value against validation regex
                if(!foundError && typeof(validRegex) !=='undefined' && validRegex !== ''){
                    if(!RegExp(validRegex).test(e.target.value)){
                        setErrorMessage('The input format is invalid.');
                        foundError = true;
                    }
                }
                if(foundError){
                    setHasErrorState(true);
                }else{
                    setHasErrorState(false);
                }
                changeHandler({hasError: foundError, value: e.target.value});
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
    hasError: PropTypes.bool,
    error: PropTypes.string,
    minLen: PropTypes.number,
    maxLen: PropTypes.number,
    required: PropTypes.bool,
    changeHandler: PropTypes.func
}

export default Input;