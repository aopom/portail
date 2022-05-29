/**
 * Displays the association calendars.
 *
 * @author Andrea Chávez 
 * @author Emma Falkiewitz
 */

import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment'; 
import Views from 'react-big-calendar';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import actions from '../redux/actions';

const localizer = BigCalendar.momentLocalizer(moment); 

let  views = Object.keys(Views).map((k) => Views[k]);

@connect(store => ({
	config: store.config,
	user: store.getData('user'),
	permissions: store.getData('user/permissions'),
	isAuthenticated: store.isFetched('user'),
	assos: store.getData('user/assos'),
	services: store.getData('user/services'),
}))

class EventsCalendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {events: []}; 
        this.state = {newEvents: []};
        const user = this.props;
        console.log(user);

    }
    loadGeneralCalendar(){
      fetch('/api/v1/eventsMobilizon')
      .then((response) => response.json())
      .then(eventsList=> {

        this.setState({ events: eventsList });
        const newEventsList = this.state.events.map(function(item) {
          return {title: item.title, start : new Date(item.beginsOn), end : new Date(item.endsOn), url: item.url}    
        });

        this.setState({newEvents: newEventsList});

      });
    }
    componentDidMount() {
       this.loadGeneralCalendar(); 
    }
    loadEventsUser(){
      this.setState({events:[]});
      this.setState({newEvents:[]});
      fetch('/api/v1/eventsMobilizonAsso/'+this.user.id)
      .then((response) => response.json())
      .then(eventsList=> {

        console.log(eventsList);

      });

    }
    render() {
       
          return (

            <div style={{margin:50}}>
              <h1 style={{marginBottom: 20}}>Calendrier générale des évènements</h1>
              <Button color="primary" outline onClick={this.loadEventsUser.bind(this)} style={{marginBottom: 30, marginTop:30, marginRight:30}}>
                Calendrier de mes assos
					    </Button>
              <Button color="secondary" outline onClick={this.loadGeneralCalendar.bind(this)} style={{marginBottom: 30, marginTop:30}}>
                Calendrier générale
					    </Button>
              <BigCalendar 
                localizer={localizer}
                events= {this.state.newEvents}
                step ={60}
                defaultDate= {new Date()}			
                style={{ height: 700 }}
                onSelectEvent={event => window.open(event.url, "_blank")}
              />
            </div>
          );
     }
 }
 
 export default EventsCalendar;
 
