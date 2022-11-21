import React from "react";
import { Container, Grid, Card, CardHeader, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export const Plans = () => {

    const plans = [
        {
            title: 'Free',
            price: 0,
            description: [
                '10 users included',
                '2 GB of storage',
                'Help center access',
                'Email support',
            ],
            buttonText: 'Sign up for free',
            buttonVariant: 'outlined',
        },
        {
            title: 'Pro',
            subheader: 'Most popular',
            price: 15,
            description: [
                '20 users included',
                '10 GB of storage',
                'Help center access',
                'Priority email support',
            ],
            buttonText: 'Get started',
            buttonVariant: 'contained',
        },
        {
            title: 'Enterprise',
            price: 30,
            description: [
                '50 users included',
                '30 GB of storage',
                'Help center access',
                'Phone & email support',
            ],
            buttonText: 'Contact us',
            buttonVariant: 'outlined',
        },
    ];

    return (
<Container maxWidth="md" component="main">
    <Grid container spacing={5} alignItems="flex-end">
    {plans.map((tier) => (
        // Enterprise card is full width at sm breakpoint
        <Grid
        item
        key={tier.title}
        xs={12}
        sm={tier.title === 'Enterprise' ? 12 : 6}
        md={4}
        >
            <Card>
                <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: 'center' }}
                action={tier.title === 'Pro' ? <StarIcon color="success" /> : null}
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
                        ${tier.price}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                        /mo
                        </Typography>
                    </Box>
                    <ul style={{listStyleType: 'none', paddingLeft: '0px'}}>
                    {tier.description.map((line) => (
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
                    <Button fullWidth variant={tier.buttonVariant}>
                    {tier.buttonText}
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    ))}
    </Grid>
</Container>
    )
}
