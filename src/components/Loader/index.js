import React from 'react';
import './loader.scss';

const Loader = ({size: Size, text: Text}) => (
    <span>
        <i className={"fa fa-spinner fa-"+Size+" fa-spin loader"} />
        {typeof(Text) !== 'undefined' && Text !== "" ?(
            <>{" "+Text}</>
        ):(
            <></>
        )}
    </span>
    
);

export default Loader;