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

    }
    render() {
          return (

            <div style={{margin:50}}>
              <h1 style={{marginBottom: 20}}>Calendrier générale des évènements</h1>
              <Button color="primary" outline onClick={this.loadEventsUser.bind(this)} className="ml-auto">
                Calendrier de mes assos
					    </Button>
              <Button color="primary" outline onClick={this.loadGeneralCalendar.bind(this)} className="ml-auto">
                Calendrier de générale
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
 
