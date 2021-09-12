import React from "react";
import { Box, Container, Paper } from "@material-ui/core"

const PublicTemplate = ({ children }) => {
    return (
		<Box m={10}>
			<Container maxWidth="sm">
				<Paper elevation={3}>
					<Box component="span" m={5} textAlign="center">
					{children}
					</Box>
				</Paper>
			</Container>
		</Box>
    )
}

export default PublicTemplate;