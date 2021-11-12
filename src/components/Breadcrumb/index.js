import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link } from "@mui/material";

export const BreadcrumbContext = React.createContext();

export const Breadcrumb = ({links}) => {
    return (
        <Breadcrumbs>
            {links !== null && links.map((link, key) => {
                    if(link.to !== null){
                        return (
                            <Link key={key} to={link.to} component={RouterLink}>{link.text}</Link>  
                        )
                    }else{
                        return (
                            <Typography key={key} color="textPrimary">{link.text}</Typography>
                        )
                    }
                    
                })
            }
        </Breadcrumbs>
    )
}

export default Breadcrumb;