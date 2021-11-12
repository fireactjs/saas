import React from "react";

const Logo = ({size}) => {
    const fontSize = size || '36px';
    return (
        <>
            <i className="fa fa-fire" style={{fontSize: fontSize, color: '#f9b115'}}></i>
        </>
    )
}

export default Logo;