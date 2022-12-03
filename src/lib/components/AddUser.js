import { FireactContext, SetPageTitle } from "@fireactjs/core";
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { useNavigate } from "react-router-dom";

export const AddUser = () => {

    const { subscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name?subscription.name:"";

    const { config } = useContext(FireactContext);
    const permissions = config.saas.permissions || {};

    const [ processing, setProcessing ] = useState(false);

    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <SetPageTitle title={"Add User"+(subscriptionName!==""?(" - "+subscriptionName):"")} />
            <Paper>
                <Box p={2}>
                    <Typography component="h1" variant="h4" align="center">Add User</Typography>
                </Box>
                <Box p={2}>
                    <TextField required fullWidth name="name" label="Name" type="text" margin="normal" onChange={(e) => {}} />
                    <TextField required fullWidth name="email" label="Email" type="email" margin="normal" onChange={(e) => {}} />
                    <Box p={1}>
                        <FormControl fullWidth>
                            <FormLabel>Permissions</FormLabel>
                            <Grid container>
                                {Object.keys(permissions).map((key, index) => {
                                    return (
                                        <Grid item xs={12} md={3} key={index}>
                                            <FormControlLabel control={<Checkbox defaultChecked={permissions[key].default?true:false} disabled={permissions[key].default?true:false} />} label={key} />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </FormControl>
                    </Box>
                </Box>
                <Box p={2}>
                    <Grid container>
                        <Grid item xs>
                            <Button type="button" color="secondary" variant="outlined" disabled={processing} onClick={() => navigate(config.pathnames.ListUsers.replace(":subscriptionId", subscription.id))} >Back</Button>
                        </Grid>
                        <Grid item>
                            <Button type="button" color="primary" variant="contained" disabled={processing} onClick={() => {}} >Save</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}