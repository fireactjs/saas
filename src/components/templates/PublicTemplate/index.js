import React from "react";

const PublicTemplate = ({ children }) => {
    return (
		<div className="c-app flex-row align-items-center">
			<div className="container">
				<div className="justify-content-center row">
					{children}
				</div>
			</div>
		</div>
    )
}

export default PublicTemplate;