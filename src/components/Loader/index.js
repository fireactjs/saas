import React from 'react';

const Loader = ({size: Size, text: Text}) => (
    <>
        <i className={"fa fa-spinner fa-"+Size+" fa-spin"} />
        {Text !== "" ?(
            <span>{Text}</span>
        ):(
            <></>
        )}
    </>
    
);

export default Loader;