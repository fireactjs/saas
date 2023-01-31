import { FireactContext } from "@fireactjs/core";
import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import StarIcon from '@mui/icons-material/Star';

export const PricingPlans = ({selectedPriceId, disabled, selectPlan, paymentMethod}) => {

    const { config } = useContext(FireactContext);
    const plans = config.saas.plans;

    return (
        <Grid container spacing={5} alignItems="flex-end">
            {plans.map((plan, i) => (
                <Grid
                    item
                    key={i}
                    xs={12}
                    sm={6}
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
                            <Box sx={{
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
                            <Button fullWidth disabled={disabled || selectedPriceId===plan.priceId?true:false} variant={plan.popular?"contained":"outlined"} onClick={(e) => {
                                selectPlan(plan);
                            }}>
                                {plan.price === 0 || paymentMethod ?"Subscribe":"Continue"}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}