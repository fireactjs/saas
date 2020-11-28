import React from "react";
import PropTypes from "prop-types";

const Field = (props) => {

    return (
        <div className="form-group row">
            <label className="col-md-2 col-lg-2 col-form-label">{props.label}</label>
            <div className="col-md-10 col-lg-5">
                {props.children}
            </div>
        </div>
    )
}

Field.propTypes = {
    label: PropTypes.string
}

export default Field;