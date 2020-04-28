import React from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";

import PublicRouter from './components/PublicRouter';
import PublicTemplate from './components/PublicTemplate';

import SignIn from './pages/public/SignIn';


function App() {
	return (
		<Router>
			<Switch>
				<PublicRouter exact path="/signin" component={SignIn} template={PublicTemplate} title="Sign In" />
			</Switch>
		</Router>
	);
}

export default App;
