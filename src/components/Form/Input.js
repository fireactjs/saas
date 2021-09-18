import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

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

    const [hasErrorState, setHasErrorState] = useState(hasError);
    const [errorMessage, setErrorMessage] = useState(error);

    useEffect(() => {
        setHasErrorState(hasError);
        setErrorMessage(error);
    }, [hasError, error]);

    return (
        <div style={{marginTop:'20px',marginBottom:'20px'}}>
            <TextField error={hasErrorState} helperText={hasErrorState && errorMessage} {...others} onChange={e => {
                let foundError = false;
                let foundErrorMessage = '';
                // validae required
                if(typeof(required) !== 'undefined' && required){
                    if(e.target.value.trim().length === 0){
                        foundErrorMessage = 'This is a required field.';
                        foundError = true;
                    }
                }

                // validate length
                if(!foundError && typeof(minLen) !== 'undefined' && minLen !== 0){
                    if(e.target.value.length < minLen){
                        foundErrorMessage = 'The input must be at least '+minLen+' characters.';
                        foundError = true;
                    }
                }
                if(!foundError && typeof(maxLen) !== 'undefined' && maxLen !== 0){
                    if(e.target.value.length > maxLen){
                        foundErrorMessage = 'The input must be no more than '+maxLen+' characters.';
                        foundError = true;
                    }
                }
                
                // validate the value against validation regex
                if(!foundError && typeof(validRegex) !=='undefined' && validRegex !== ''){
                    if(!RegExp(validRegex).test(e.target.value)){
                        foundErrorMessage = 'The input format is invalid.';
                        foundError = true;
                    }
                }
                if(foundError){
                    setHasErrorState(true);
                    setErrorMessage(foundErrorMessage);
                }else{
                    setHasErrorState(false);
                }
                changeHandler({
                    hasError: foundError,
                    error: foundErrorMessage,
                    value: e.target.value
                });
            }} />
        </div>
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