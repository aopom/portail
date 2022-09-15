/**
 * Assemblage, chargement et composition de l'application entière
 *
 * @author Alexandre Brasseur <abrasseur.pro@gmail.com>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Corentin Mercier <corentin@cmercier.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GNU GPL-3.0
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Components
import { NotificationContainer } from 'react-notifications';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ErrorCatcher from './routes/ErrorCatcher';
import Http404 from './routes/Http404';
import LoggedRoute from './routes/Logged';

// Screens
import AppLoader from './AppLoader';
import HomeScreen from './screens/Home';
import AssoListScreen from './screens/AssoList';
import ServiceListScreen from './screens/ServiceList';
import AssoDetailScreen from './screens/Asso';
import ProfileScreen from './screens/Profile';
import BookingScreen from './screens/Booking';
import PartnersListScreen from './screens/PartnersList';
import EvenementsCalendarScreen from './screens/Evenements'


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			children: <AppLoader generateChildren={this.generateChildren.bind(this)} />,
		};
	}

	generateChildren() {
		setTimeout(() => {
			this.setState({
				children: (
					<div className="h-100">
						<div className="d-flex w-100">
							<Navbar />

							<div className="d-flex w-100">
								<Sidebar />

								<main>
									<ErrorCatcher>
										<Switch>
											<Route path="/" exact component={HomeScreen} />
											<Route path="/assos" exact component={AssoListScreen} />
											<Route path="/assos/:login" component={AssoDetailScreen} />
											<Route path="/services" exact component={ServiceListScreen} />
											<Route path="/partners" exact component={PartnersListScreen} />
											<Route path="/evenements" exact component={EvenementsCalendarScreen} />
											<LoggedRoute path="/profile" component={ProfileScreen} />
											<LoggedRoute
												path="/bookings"
												types={['contributorBde']}
												component={BookingScreen}
											/>
											<Route component={Http404} />
										</Switch>
									</ErrorCatcher>
								</main>
							</div>
						</div>

						<NotificationContainer />
					</div>
				),
			});
		}, 100);
	}

	render() {
		const { children } = this.state;

		return children;
	}
}

export default App;
