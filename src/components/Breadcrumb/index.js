import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link } from "@material-ui/core";

export const BreadcrumbContext = React.createContext();

export const Breadcrumb = ({links}) => {
    return (
        <Breadcrumbs>
            {links !== null && links.map((link, key) => {
                    return (
                        <>
                            {link.to !== null && 
                                <Link to={link.to} component={RouterLink}>{link.text}</Link>
                            }
                            {link.to === null && 
                                <Typography color="textPrimary">{link.text}</Typography>
                            }
                        </>
                    )
                })
            }
        </Breadcrumbs>
    )
}

export default Breadcrumb;