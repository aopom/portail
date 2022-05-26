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
          console.log(eventsList);

          this.setState({ events: eventsList });


          const newEventsList = this.state.events.map(function(item) {
            return {title: item.title, start : new Date(item.beginsOn), end : new Date(item.endsOn)}    
          });
          console.log(newEventsList);

          this.setState({newEvents: newEventsList});
          console.log(newEvents);

        });
    }

    

    render() {
       
        const events = this.state.newEvents.map((item, i) => (
            <div key={i}>
              <h1>{ item.title }</h1>
            </div>
          ));
      
          return (
            <div id="layout-content" className="layout-content-wrapper">
              <div className="panel-list">{ events }</div> 
              <BigCalendar 
                localizer={localizer}
                events= {this.state.newEvents}
                step ={60}
                defaultDate= {new Date()}			
                style={{ height: 500 }}

             />
            </div>
          );
     }
 }
 
 export default EventsCalendar;
 
