import React from "react";
import { Stack } from "@mui/material";

const ButtonRow = ({ children }) => {
    return (
        <Stack direction="row" spacing={1} mt={2}>
            {children}
        </Stack>
    );
}

export default ButtonRow;