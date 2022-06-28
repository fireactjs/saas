import React, { useContext, useEffect, Suspense, useState } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import Loader from "../../../../components/Loader";

const components = [];
  
// Here: catch and return another lazy (promise)
const requireComponents = require.context(
    '../../../../features', // components folder
    true, // look subfolders
    /\w+FeatureRoutes\.(js)$/ //regex for files
);
requireComponents.keys().forEach((filePath) => {
    const folder = filePath.split("/")[1];
    const name = filePath.split("/")[2];
    const Feature = React.lazy(() =>
    import("../../../../features/" + folder + "/" + name));
    components.push(<Feature key={components.length+1} />);
});

export const titleContext = React.createContext();

export const Feature = () => {
    const [ title, setTitle ] = useState("Default Feature");

    const { userData } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    
    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/",
                text: userData.currentAccount.name,
                active: false
            },      
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    }, [userData, setBreadcrumb, title]);

    return (
        <>
            {(components.length > 0)?(
                <titleContext.Provider value={{title, setTitle}} >
                    <Suspense fallback={<Loader />}>
                        {components}
                    </Suspense>
                </titleContext.Provider>
            ):(
                <div>This is the default feature</div>
            )}
        </>

    )
}