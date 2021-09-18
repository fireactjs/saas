import React, {useContext, useEffect} from "react";
import {BreadcrumbContext} from '../../Breadcrumb';
import { Box, Container, Paper } from "@mui/material";

const UserPageLayout = (props) => {
    const {
        title,
        children
    } = props

    const { setBreadcrumb } = useContext(BreadcrumbContext);
    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/user/profile",
                text: "User",
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    },[setBreadcrumb, title]);
    
    
    

    return (
        <Container>
            <Paper>
                <Box p={2}>
                    {children}
                </Box>
            </Paper>
        </Container>
    )
}

export default UserPageLayout;