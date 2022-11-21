import React, { useState } from "react";
import { Container, Paper, Grid, Card, CardHeader, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { SetPageTitle } from "@fireactjs/core";

const PriceTable = ({setPriceId, plans}) => {

    return (
        <Box p={5}>
        <Typography
        component="h1"
        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
        mb={8}
        >
            Choose Your Plan
            </Typography>
            <Grid container spacing={5} alignItems="flex-end">
            {plans.map((plan) => (
                // Enterprise card is full width at sm breakpoint
                <Grid
                item
                key={plan.title}
                xs={12}
                sm={plan.title === 'Enterprise' ? 12 : 6}
                md={4}
                >
                    <Card>
                        <CardHeader
                        title={plan.title}
                        subheader={plan.popular ? "Most Popular": ""}
                        titleTypographyProps={{ align: 'center' }}
                        action={plan.popular ? <StarIcon color="success" /> : null}
                        subheaderTypographyProps={{
                        align: 'center',
                        }}
                        sx={{
                        backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                        }}
                        />
                        <CardContent>
                            <Box
                            sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                            mb: 2,
                            }}
                            >
                                <Typography variant="h4" color="text.primary">
                                {plan.currency}
                                </Typography>
                                <Typography component="h2" variant="h3" color="text.primary">
                                {plan.price}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                /{plan.frequency}
                                </Typography>
                            </Box>
                            <ul style={{listStyleType: 'none', paddingLeft: '0px'}}>
                            {plan.description.map((line) => (
                                <Typography
                                component="li"
                                variant="subtitle1"
                                align="center"
                                key={line}
                                >
                                    {line}
                                </Typography>
                            ))}
                            </ul>
                        </CardContent>
                        <CardActions>
                            <Button fullWidth variant={plan.popular?"contained":"outlined"} onClick={() => setPriceId(plan.priceId)}>
                            Continue
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
            </Grid>
        </Box>
    )
}


export const Plans = () => {

    const [priceId, setPriceId] = useState("");

    const plans = [
        {
            title: 'Free',
            popular: false,
            priceId: 'price_1M5hqYDtHLeC8Nf8p5A3qZo1',
            currency: '$',
            price: 0,
            frequency: 'week',
            description: [
                '10 users included',
                '2 GB of storage',
                'Help center access',
                'Email support',
            ]
        },
        {
            title: 'Weekly',
            popular: true,
            priceId: 'price_1M5hsTDtHLeC8Nf8m90FMVNX',
            currency: '$',
            price: 10,
            frequency: 'week',
            description: [
                '20 users included',
                '10 GB of storage',
                'Help center access',
                'Priority email support',
            ]
        },
        {
            title: 'Monthly',
            popular: false,
            priceId: 'price_1M6hVyDtHLeC8Nf8pnaZ0Cb3',
            currency: '$',
            price: 30,
            frequency: 'mo',
            description: [
                '50 users included',
                '30 GB of storage',
                'Help center access',
                'Phone & email support',
            ]
        },
    ];

    return (
        <Container maxWidth="lg">
            <SetPageTitle title="Choose Plan" />
            <Paper>
                {priceId === "" && 
                    <PriceTable setPriceId={setPriceId} plans={plans} />
                }
            </Paper>
        </Container>
    )
}
