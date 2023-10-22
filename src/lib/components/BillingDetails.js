import React, { useState } from "react";
import { Grid, Stack, Box, Button, TextField } from '@mui/material';
import { CountryField, StateField, VisitorAPIComponents } from 'react-country-state-fields';


export const BillingDetails = ({setBillingDetailsObject, buttonText, disabled}) => {
    const [ billingDetails, setBillingDetails ] = useState({
        name: "",
        address: {
            line1: "",
            line2: "",
            city: "",
            postal_code: "",
            state: "",
            stateObj: {},
            country: "",
            countryObj: {}
        }
    });

    return (
        <Stack spacing={3}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item md={8}>
                    <Box p={2}>
                        <TextField fullWidth name="name" label="Business Name" type="text" margin="normal" onChange={(e) => {
                            setBillingDetails(prevState => ({
                                ...prevState,
                                name: e.target.value
                            }))
                        }} />
                        <TextField fullWidth name="line1" label="Address Line 1" type="text" margin="normal" onChange={(e) => {
                            setBillingDetails(prevState => ({
                                ...prevState,
                                address:{
                                    ...prevState.address,
                                    line1: e.target.value
                                }
                            }))
                        }} />
                        <TextField fullWidth name="line2" label="Address Line 2" type="text" margin="normal" onChange={(e) => {
                            setBillingDetails(prevState => ({
                                ...prevState,
                                address:{
                                    ...prevState.address,
                                    line2: e.target.value
                                }
                            }))
                        }} />
                        <Grid container>
                            <Grid item md={7}>
                                <TextField fullWidth name="city" label="City / Suburb" type="text" margin="normal" onChange={(e) => {
                                    setBillingDetails(prevState => ({
                                        ...prevState,
                                        address:{
                                            ...prevState.address,
                                            city: e.target.value
                                        }
                                    }))
                                }} />
                            </Grid>
                            <Grid item md={1}></Grid>
                            <Grid item md={4}>
                                <TextField fullWidth name="postal_code" label="Postal Code" type="text" margin="normal" onChange={(e) => {
                                    setBillingDetails(prevState => ({
                                        ...prevState,
                                        address:{
                                            ...prevState.address,
                                            postal_code: e.target.value
                                        }
                                    }))
                                }} />
                            </Grid>
                        </Grid>
                        <VisitorAPIComponents projectId={""} handleCountryChange={(countryObj) => {
                                    setBillingDetails(prevState => ({
                                        ...prevState,
                                        address:{
                                            ...prevState.address,
                                            countryObj: countryObj,
                                            country: (countryObj && countryObj.code)?countryObj.code:""
                                        }
                                    }))
                                }} handleStateChange={(stateObj) => {
                                    setBillingDetails(prevState => ({
                                        ...prevState,
                                        address:{
                                            ...prevState.address,
                                            stateObj: stateObj,
                                            state: (stateObj && stateObj.label)?stateObj.label:""
                                        }
                                    }))
                                }}>
                            <Grid container>
                                <Grid item md={7}>
                                    <Box pt={2} pb={1}>
                                        <CountryField label="Country / Territory"></CountryField>
                                    </Box>
                                </Grid>
                                <Grid item md={1}></Grid>
                                <Grid item md={4}>
                                    <Box pt={2} pb={1}>
                                        <StateField label="State / Province" fullWidth></StateField>
                                    </Box>
                                </Grid>
                            </Grid>
                        </VisitorAPIComponents>
                    </Box>
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Button variant="contained" disabled={disabled} onClick={e => setBillingDetailsObject(billingDetails)}>{buttonText}</Button>
            </Grid>
        </Stack>
    )
}