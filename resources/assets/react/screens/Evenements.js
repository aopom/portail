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

 const localizer = BigCalendar .momentLocalizer(moment); 

 let  views = Object.keys(Views).map((k) => Views[k]);

 class EventsCalendar extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {events: []}; 
        this.state = {newEvents: []};

    }
    componentDidMount() {
        fetch('/api/v1/eventsMobilizon')
        .then((response) => response.json())
        .then(eventsList=> {

          this.setState({ events: eventsList });
          const newEventsList = this.state.events.map(function(item) {
            return {title: item.title, start : new Date(item.beginsOn), end : new Date(item.endsOn)}    
          });

          this.setState({newEvents: newEventsList});

        });
    }

    

    render() {
          return (

            <div style={{margin:50}}>
              <h1>Calendrier générale des évènements</h1>
              <BigCalendar 
                localizer={localizer}
                events= {this.state.newEvents}
                step ={60}
                defaultDate= {new Date()}			
                style={{ height: 700 }}

              />
            </div>
          );
     }
 }
 
 export default EventsCalendar;
 
