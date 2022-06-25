import React, { useContext, useEffect, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import { AuthContext } from '../../FirebaseAuth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';

const components = [];
  
// Here: catch and return another lazy (promise)
const requireComponents = require.context(
    '../../../features', // components folder
    true, // look subfolders
    /\w+FeatureMenu\.(js)$/ //regex for files
);
requireComponents.keys().forEach((filePath) => {
    const folder = filePath.split("/")[1];
    const name = filePath.split("/")[2];
    const Feature = React.lazy(() =>
    import("../../../features/" + folder + "/" + name));
    components.push(<Feature key={components.length+1} />);
});

const AccountMenu = () => {

    const { accountId } = useParams();

    const { userData } = useContext(AuthContext);

    useEffect(() => {
        document.querySelectorAll('.c-sidebar').forEach(element => {
            window.coreui.Sidebar._sidebarInterface(element)
        });
    })

    return (
        <List>
            <Suspense fallback={<></>}>
                {components}
            </Suspense>
            {userData.currentAccount.role === 'admin' && 
            <>
                <Link to={'/account/'+accountId+'/users'} style={{textDecoration:'none'}}>
                    <ListItem button key="Users">
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary={<Typography color="textPrimary">Users</Typography>} />
                    </ListItem>
                </Link>
                <Link to={'/account/'+accountId+'/billing'} style={{textDecoration:'none'}}>
                    <ListItem button key="Billing">
                        <ListItemIcon><PaymentIcon /></ListItemIcon>
                        <ListItemText primary={<Typography color="textPrimary">Billing</Typography>} />
                    </ListItem>
                </Link>
            </>
            }
        </List>
    )
}

export default AccountMenu;