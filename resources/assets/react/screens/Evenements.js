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
        fetch('/api/v1/eventsMobilizon')
        .then((response) => response.json())
        .then(eventsList=> {
          console.log(eventsList);
          this.setState({ events: JSON.parse(eventsList) });

        });
    }

    render() {
       
        const events = this.state.events.map((item) => (
            <div>
              <h1>{ item }</h1>
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
 