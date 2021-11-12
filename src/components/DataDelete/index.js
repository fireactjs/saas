import React, { useState } from "react";
import { Button, Dialog, DialogTitle, Box, Stack } from "@mui/material";

const DataDelete = ({id, handleDeletion}) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" color="error" onClick={() => setOpen(true)}>
                Delete
            </Button>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>Delete</DialogTitle>
                <Box p={3}>
                    Confirm deletion?
                    <Stack direction="row" spacing={1} mt={2}>
                        <Button variant="contained" color="error" onClick={() => handleDeletion(id)}>Yes</Button>
                        <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                    </Stack>
                </Box>
            </Dialog>
        </>
    )
}

export default DataDelete;