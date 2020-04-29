import React from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthProvider } from './components/FirebaseAuth';

import PublicRouter from './components/PublicRouter';
import PublicTemplate from './components/PublicTemplate';

import AuthRouter from './components/AuthRouter';

import SignIn from './pages/public/SignIn';
import Home from './pages/auth/Home';
import PageNotFound from './pages/public/PageNotFound';


function App() {
	return (
		<AuthProvider>
			<Router>
				<Switch>
					<AuthRouter exact path="/" component={Home} template={PublicTemplate} title="Welcome" />
					<PublicRouter exact path="/signin" component={SignIn} template={PublicTemplate} title="Sign In" />
					<PublicRouter component={PageNotFound} template={PublicTemplate} title="Page Not Found" />
				</Switch>
			</Router>
		</AuthProvider>
	);
}

export default App;
