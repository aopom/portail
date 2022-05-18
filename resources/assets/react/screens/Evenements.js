/**
 * Displays the association calendars.
 *
 * @author Andrea Chávez 
 *
 */

 import React from 'react';


 class EventsCalendar extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {events: []}; /* Petit preuve pour eviter redux */
    }
    componentDidMount() {
        this.EventList();
    }
    EventList() {
        $.getJSON('https://assos.utc.fr/api/v1/assos')
          .then(({ results }) => this.setState({ person: results }));
    }

    render() {
       
        const events = this.state.events.map((item, i) => (
            <div>
              <h1>{ item.name }</h1>
              <h2>{ item.image }</h2>
            </div>
          ));
      
          return (
            <div id="layout-content" className="layout-content-wrapper">
              <div className="panel-list">{ events }</div>
            </div>
          );
     }
 }
 
 export default EventsCalendar;
 