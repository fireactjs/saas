import React from "react";
import PropTypes from "prop-types";

const Form = (props) => {

    const {handleSubmit, ...others} = props;

    return (
        <form {...others} onSubmit={handleSubmit}>
            {props.children}
        </form>
    )
}

Form.propTypes = {
    handleSubmit: PropTypes.func
}

export default Form;