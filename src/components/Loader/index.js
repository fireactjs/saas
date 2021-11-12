import React from 'react';
import { CircularProgress, Typography } from "@mui/material"

const Loader = ({size: Size, text: Text}) => {
    if(!Size){
        Size=22;
    }

    const fontStyle = {
        paddingLeft: Size/10+'px',
        fontSize: Size+'px',
    };

    return(
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        }}>
            <CircularProgress size={Size} />
            {typeof(Text) !== 'undefined' && Text !== "" ?(
                <Typography style={fontStyle}>{Text}</Typography>
            ):(
                <></>
            )}
        </span>
    );
};

export default Loader;