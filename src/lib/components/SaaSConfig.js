import React from "react";

export const SaaSConfigContext = React.createContext();

export const SaaSConfigProvider = ({config, children}) => {

    return (
        <SaaSConfigContext.Provider value={{
            config
        }}>
            {children}
        </SaaSConfigContext.Provider>
    )
}