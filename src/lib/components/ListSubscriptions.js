import { SetPageTitle } from "@fireactjs/core";
import { Container, Paper } from "@mui/material";
import React from "react";

export const ListSubscriptions = () => {
    return (
        <Container>
            <SetPageTitle title="My Subscriptions" />
            <Paper>
                <h2>My Subscriptions</h2>
            </Paper>
        </Container>
    )
}