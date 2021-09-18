import React, { useContext, useEffect } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { Link } from "react-router-dom";
import { Box, Container, Paper } from "@mui/material";


const Overview = () => {
    const title = 'Overview';

    const { userData } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    
    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/",
                text: userData.currentAccount.name,
                active: false
            },      
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    }, [userData, setBreadcrumb, title]);

    return (
        <>
            <Container>
                <Paper>
                    <Box p={2}>
                        <p>This is the overview of the account</p>
                        {!userData.currentAccount.subscriptionStatus && 
                        <p>Account status is not active, <Link to={"/account/"+userData.currentAccount.id+"/plan"}>activate a plan here to continue</Link>.</p>
                        }
                    </Box>
                </Paper>
            </Container>
        </>

    )
}

export default Overview;