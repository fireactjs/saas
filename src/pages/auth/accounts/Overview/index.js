import React, { useContext, useEffect, Suspense } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import Loader from "../../../../components/Loader";
import DemoFeatureRoutes from "../../../../features/demo/DemoFeatureRoutes";

    // registry for components
    const components = [<DemoFeatureRoutes />];

    
    // Create component
    const makeComponent = (path) => React.lazy(() => import(`${path}`));

    // Get paths (Webpack)
    const requireComponent = require.context(
        '../../../../features', // components folder
        true, // look subfolders
        /\w+FeatureRoutes\.(js)$/ //regex for files
    );

    requireComponent.keys().forEach((filePath) => {
        // Get component config
        // const Component = requireComponent(filePath);
        const Component = makeComponent(filePath);
        // Get PascalCase name of component
        const componentName = filePath.split('/').pop().replace(/\.\w+$/, '');

        components[componentName] = (Component);
    });
    


const Overview = () => {


    const title = 'Overview';

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
            <Suspense fallback={<Loader />}>
                {components}
            </Suspense>
        </>
    )
}

export default Overview;