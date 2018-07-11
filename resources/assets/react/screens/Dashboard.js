import React, { Component } from 'react';

import AuthorizedClients from './../components/Passport/AuthorizedClients.js';
import Clients from './../components/Passport/Clients.js';
import PersonalAccessTokens from './../components/Passport/PersonalAccessTokens.js';

class DashboardScreen extends Component {
	render() {
		return (
			<div className="container">
				<h1>Dashboard</h1>
				<AuthorizedClients />
				<Clients />
				<PersonalAccessTokens />
			</div>
		);
	}
}

export default DashboardScreen;