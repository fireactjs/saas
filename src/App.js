import './App.css';
import firebaseConfig from "./firebaseConfig.json";
import { pathnames, AppTemplate, AuthProvider, AuthRoutes, MainMenu, PublicTemplate, ResetPassword, SignIn, SignUp, UserMenu, UserProfile, UserUpdateEmail, UserUpdateName, UserUpdatePassword, UserDelete, FireactProvider, ActionPages } from '@fireactjs/core';
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { CircularProgress, Box } from '@mui/material';
import authMethods from "./authMethods.json";
import { CreateSubscription, ListSubscriptions, pathnames as subPathnames, PermissionRouter, Settings, SubscriptionMenu, ListUsers, SubscriptionProvider, ListInvoices, ManagePaymentMethods, ChangePlan, CancelSubscription, UpdateBillingDetails } from './lib';
import SaaSConfig from './config.json';

const Brand = "FIREACT";

const Logo = ({size, color}) => {
	const logoColor = color || 'warning';
	return (
		<LocalFireDepartmentIcon color={logoColor} fontSize={size} />
	);
}

const Loader = ({size}) => {
	let cpSize = "35px";
	switch(size){
		case "small":
			cpSize = "30px";
			break;
		case "medium":
			cpSize = "35px";
			break;
		case "large":
			cpSize = "45px";
			break;
		default:
			cpSize = "35px";
			break;
	}
	return (
		<Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center"}}>
			<CircularProgress color="warning" size={cpSize} />
			<div style={{position: "absolute" }}>
				<Logo size={size} />
			</div>
		</Box>
	);
}

function App() {

	// merge pathnames
	for(var key in subPathnames){
		pathnames[key] = subPathnames[key];
	}

	const config = {
		firebaseConfig: firebaseConfig,
		brand: "FIREACTJS",
		pathnames: pathnames,
		authProviders: authMethods,
		saas: SaaSConfig
	}

	return (
		<FireactProvider config={config}>
			<AuthProvider firebaseConfig={firebaseConfig} brand={Brand}>
				<BrowserRouter>
					<Routes>
						<Route element={<AuthRoutes loader={<Loader size="large" />} />} >
							<Route element={<AppTemplate logo={<Logo size="large" />} toolBarMenu={<UserMenu />} drawerMenu={<MainMenu />} />}>
								<Route exact path={pathnames.ListSubscriptions} element={<ListSubscriptions loader={<Loader size="large" />} />} />
								<Route exact path={pathnames.CreateSubscription} element={<CreateSubscription />} />
								<Route exact path={pathnames.UserProfile} element={<UserProfile />} />
								<Route exact path={pathnames.UserUpdateEmail} element={<UserUpdateEmail />} />
								<Route exact path={pathnames.UserUpdateName} element={<UserUpdateName />} />
								<Route exact path={pathnames.UserUpdatePassword} element={<UserUpdatePassword />} />
								<Route exact path={pathnames.UserDelete} element={<UserDelete />} />
							</Route>
							
							<Route path={pathnames.Subscription} element={<SubscriptionProvider loader={<Loader size="large" />} />} >
								<Route element={<AppTemplate logo={<Logo size="large" />} toolBarMenu={<UserMenu />} drawerMenu={<SubscriptionMenu />} />}>
									<Route element={<PermissionRouter permissions={["access"]} />} >
										<Route exact path={pathnames.Subscription+"/"} element={<div>Home</div>} />
									</Route>
									<Route element={<PermissionRouter permissions={["admin"]} />} >
										<Route exact path={pathnames.Settings} element={<Settings loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ListUsers} element={<ListUsers loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ListInvoices} element={<ListInvoices loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ManagePaymentMethods} element={<ManagePaymentMethods loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.UpdateBillingDetails} element={<UpdateBillingDetails loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ChangePlan} element={<ChangePlan />} />
										<Route exact path={pathnames.CancelSubscription} element={<CancelSubscription />} />
									</Route>
								</Route>
							</Route>
						</Route>
						<Route element={<PublicTemplate />}>
							<Route path={pathnames.SignIn} element={
								<SignIn
									logo={<Logo size="large" />}
								/>
							} />
							<Route path={pathnames.SignUp} element={
								<SignUp
									logo={<Logo size="large" />}
								/>
							} />
							<Route path={pathnames.ResetPassword} element={
								<ResetPassword
									logo={<Logo size="large" />}
								/>
							} />
							<Route path={pathnames.ActionPages} element={
								<ActionPages
									logo={<Logo size="large" />}
								/>
							} />
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</FireactProvider>
	)
}

export default App;