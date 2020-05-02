import React from "react";

const Alert = ({type, message, dismissible}) => {

    return (
        <div class={"alert fade show"+" alert-"+type+(dismissible?" alert-dismissible":"")} role="alert">
            {message}
            {dismissible && 
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                </button>
            }
        </div>
    )
}

export default Alert;