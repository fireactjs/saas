import React from 'react';  
import { Route, withRouter } from "react-router-dom";

const PublicRouter = ({component: Component, template: Template, title: Title, ...rest}) => {
    
    document.title = Title;
    
    return ( 
        <Route
            {...rest}
            render={ matchProps => (
            <Template {...rest}>
                <Component {...matchProps} />  
            </Template>
            )}
        />
    );
}
export default withRouter(PublicRouter);