import React from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthProvider } from './components/FirebaseAuth';

import PublicRouter from './components/routers/PublicRouter';
import PublicTemplate from './components/templates/PublicTemplate';

import AuthRouter from './components/routers/AuthRouter';

import SignIn from './pages/public/SignIn';
import Home from './pages/auth/Home';
import PageNotFound from './pages/public/PageNotFound';
import AppTemplate from './components/templates/AppTemplate';
import UserProfile from './pages/auth/user/UserProfile';
import UpdateEmail from './pages/auth/user/UpdateEmail';
import UpdateName from './pages/auth/user/UpdateName';
import VerifyEmail from './pages/auth/user/VerifyEmail';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Switch>
					<AuthRouter exact path="/" component={Home} template={AppTemplate} title="Welcome" />
					<AuthRouter exact path="/user/profile" component={UserProfile} template={AppTemplate} title="User Profile" />
					<AuthRouter exact path="/user/profile/update-email" component={UpdateEmail} template={AppTemplate} title="Change Your Email" />
					<AuthRouter exact path="/user/profile/update-name" component={UpdateName} template={AppTemplate} title="Change Your Name" />
					<AuthRouter exact path="/user/profile/verify-email" component={VerifyEmail} template={AppTemplate} title="Verify Your Name" />
					<PublicRouter exact path="/signin" component={SignIn} template={PublicTemplate} title="Sign In" />
					<PublicRouter component={PageNotFound} template={PublicTemplate} title="Page Not Found" />
				</Switch>
			</Router>
		</AuthProvider>
	);
}

export default App;
