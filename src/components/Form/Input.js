import React from "react";
import PropTypes from "prop-types";

const Input = (props) => {

    return (
        <input className="form-control" {...props} />
    )
}

Input.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string
}

export default Input;