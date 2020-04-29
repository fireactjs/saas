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


function App() {
	return (
		<AuthProvider>
			<Router>
				<Switch>
					<AuthRouter exact path="/" component={Home} template={AppTemplate} title="Welcome" />
					<PublicRouter exact path="/signin" component={SignIn} template={PublicTemplate} title="Sign In" />
					<PublicRouter component={PageNotFound} template={PublicTemplate} title="Page Not Found" />
				</Switch>
			</Router>
		</AuthProvider>
	);
}

export default App;
