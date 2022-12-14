import { FireactContext, SetPageTitle } from "@fireactjs/core";
import { Box, Container, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { PricingPlans } from "./PricingPlans";
import { SubscriptionContext } from "./SubscriptionContext";

export const ChangePlan = () => {

    const { subscription } = useContext(SubscriptionContext);
    const { config } = useContext(FireactContext);


    return (
        <Container maxWidth="lx">
            <SetPageTitle title={"Change Plan"+(subscription.name!==""?(" - "+subscription.name):"")} />
            <Paper>
                <Box p={5}>
                    <Typography
                    component="h1"
                    variant="h3"
                    align="center"
                    color="text.primary"
                    gutterBottom
                    mb={8}
                    >
                    Choose a Plan
                    </Typography>
                    <PricingPlans selectedPriceId={subscription.stripePriceId} />
                </Box>
                
            </Paper>
            
        </Container>
    )
}