import React from "react";
import PropTypes from "prop-types";
import Field from './Field';
import { useHistory } from 'react-router-dom';
import Loader from '../Loader';
import { Button, makeStyles } from "@material-ui/core";

const Form = (props) => {

    const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            margin: theme.spacing(1),
          },
        },
    }));
    const classes = useStyles();
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
        <form {...others} onSubmit={handleSubmit}>
            {children}
            {enableDefaultButtons && 
                <div className={classes.root}>
                    <Button variant="contained" color={btnClass} disabled={disabled} onClick={handleSubmit}>
                        {inSubmit && 
                            <Loader />
                        }
                        {submitBtnText || 'Submit'}
                    </Button>
                    {backToUrl && backToUrl !== "" &&
                        <Button variant="contained" disabled={inSubmit} onClick={(e) => {
                            e.preventDefault();
                            history.push(backToUrl);
                        }}>
                            {backBtnText || 'Back'}
                        </Button>
                    }
                </div>
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