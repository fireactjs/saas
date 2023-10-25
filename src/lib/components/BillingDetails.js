import React, { useEffect, useState } from "react";
import { Grid, Stack, Box, Button, TextField } from '@mui/material';
import { CountryField, StateField, VisitorAPIComponents } from 'react-country-state-fields';


export const BillingDetails = ({setBillingDetailsObject, buttonText, disabled, currentBillingDetails}) => {
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

    useEffect(() => {
        if(currentBillingDetails){
            setBillingDetails(currentBillingDetails);
        }
    }, [currentBillingDetails])

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
                        }} value={billingDetails.name} />
                        <TextField fullWidth name="line1" label="Address Line 1" type="text" margin="normal" onChange={(e) => {
                            setBillingDetails(prevState => ({
                                ...prevState,
                                address:{
                                    ...prevState.address,
                                    line1: e.target.value
                                }
                            }))
                        }} value={billingDetails.address.line1} />
                        <TextField fullWidth name="line2" label="Address Line 2" type="text" margin="normal" onChange={(e) => {
                            setBillingDetails(prevState => ({
                                ...prevState,
                                address:{
                                    ...prevState.address,
                                    line2: e.target.value
                                }
                            }))
                        }}  value={billingDetails.address.line2} />
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
                                }}  value={billingDetails.address.city} />
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
                                }} value={billingDetails.address.postal_code} />
                            </Grid>
                        </Grid>
                        <VisitorAPIComponents projectId={""} handleCountryChange={(countryObj) => {
                                    if(countryObj !== null){
                                        setBillingDetails(prevState => ({
                                            ...prevState,
                                            address:{
                                                ...prevState.address,
                                                countryObj: countryObj,
                                                country: (countryObj && countryObj.code)?countryObj.code:""
                                            }
                                        }));
                                    }
                                }} handleStateChange={(stateObj) => {
                                    if(stateObj !== null){
                                        setBillingDetails(prevState => ({
                                            ...prevState,
                                            address:{
                                                ...prevState.address,
                                                stateObj: stateObj,
                                                state: (stateObj && stateObj.label)?stateObj.label:""
                                            }
                                        }));    
                                    }
                                }} defaultCountryCode={billingDetails.address.country} defaultStateCode={billingDetails.address.stateObj.code}>
                            <Grid container>
                                <Grid item md={7}>
                                    <Box pt={2} pb={1}>
                                        <CountryField label="Country / Territory" value={billingDetails.address.countryObj}></CountryField>
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