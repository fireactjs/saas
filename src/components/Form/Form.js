import React from "react";
import PropTypes from "prop-types";
import Field from './Field';
import { Link } from 'react-router-dom';
import Loader from '../Loader';

const Form = (props) => {

    const {
        handleSubmit,
        disabled,
        inSubmit,
        enableDefaultButtons,
        submitBtnText,
        backBtnText,
        backToUrl,
        children,
        ...others} = props;

    return (
        <form {...others} onSubmit={handleSubmit}>
            {children}
            {enableDefaultButtons && 
                <Field>
                    <button className="btn btn-primary mr-2" disabled={(disabled?'disabled':'')}>
                        {inSubmit && 
                            <Loader />
                        }
                        {submitBtnText || 'Submit'}
                    </button>
                    {backToUrl && backToUrl !== "" &&
                        <Link className={"btn btn-secondary"+(inSubmit?" disabled":"")} to={backToUrl}>
                            {backBtnText || 'Back'}
                        </Link>
                    }
                </Field>
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