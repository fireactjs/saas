import React from "react";

const AppTemplate = ({ children }) => {
    return (
		<>
            <header class="app-header navbar">

            </header>
            <div class="app-body">
                <div class="sidebar">

                </div>
                <main class="main">
                {children}
                </main>
            </div>
            <footer class="app-footer">

            </footer>
        </>
    )
}

export default AppTemplate;