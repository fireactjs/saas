import React from "react";
import { Container, Paper, Grid, Card, CardHeader, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { SetPageTitle } from "@fireactjs/core";

export const Plans = () => {

    const plans = [
        {
            title: 'Free',
            popular: false,
            price: 0,
            frequency: 'mo',
            description: [
                '10 users included',
                '2 GB of storage',
                'Help center access',
                'Email support',
            ]
        },
        {
            title: 'Pro',
            popular: true,
            price: 15,
            frequency: 'mo',
            description: [
                '20 users included',
                '10 GB of storage',
                'Help center access',
                'Priority email support',
            ]
        },
        {
            title: 'Enterprise',
            popular: false,
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
                                        <Typography component="h2" variant="h3" color="text.primary">
                                        ${plan.price}
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
                                    <Button fullWidth variant={plan.popular?"contained":"outlined"}>
                                    Get Started
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}
