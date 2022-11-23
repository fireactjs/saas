import './App.css';
import firebaseConfig from "./firebaseConfig.json";
import { pathnames, AppTemplate, AuthProvider, AuthRoutes, MainMenu, PublicTemplate, ResetPassword, SignIn, SignUp, UserMenu, UserProfile, UserUpdateEmail, UserUpdateName, UserUpdatePassword, UserDelete } from '@fireactjs/core';
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { CircularProgress, Box } from '@mui/material';
import authMethods from "./authMethods.json";
import { CreateSubscription } from './lib/components';
import config from './config.json';

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

	return (
		<AuthProvider firebaseConfig={firebaseConfig} brand={Brand}>
			<BrowserRouter>
				<Routes>
					<Route element={<AuthRoutes signInPath={pathnames.SignIn} loader={<Loader size="large" />} />} >
						<Route element={<AppTemplate logo={<Logo size="large" />} brand={Brand} toolBarMenu={<UserMenu pathnames={pathnames} />} drawerMenu={<MainMenu pathnames={pathnames}  />} />}>
							<Route exact path="/" element={<CreateSubscription plans={config.plans} stripePublicKey={config.stripe.public_api_key} />} />
							<Route exact path={pathnames.UserProfile} element={<UserProfile pathnames={pathnames} />} />
							<Route exact path={pathnames.UserUpdateEmail} element={<UserUpdateEmail pathnames={pathnames} />} />
							<Route exact path={pathnames.UserUpdateName} element={<UserUpdateName pathnames={pathnames} />} />
							<Route exact path={pathnames.UserUpdatePassword} element={<UserUpdatePassword pathnames={pathnames} />} />
							<Route exact path={pathnames.UserDelete} element={<UserDelete pathnames={pathnames} />} />
						</Route>
					</Route>
					<Route element={<PublicTemplate />}>
						<Route path={pathnames.SignIn} element={
							<SignIn
								logo={<Logo size="large" />}
								pathnames={pathnames}
								providers={authMethods}
							/>
						} />
						<Route path={pathnames.SignUp} element={
							<SignUp
								logo={<Logo size="large" />}
								pathnames={pathnames}
							/>
						} />
						<Route path={pathnames.ResetPassword} element={
							<ResetPassword
								logo={<Logo size="large" />}
								pathnames={pathnames}
							/>
						} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App;