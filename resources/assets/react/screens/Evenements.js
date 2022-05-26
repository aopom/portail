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
    
        this.state = {events: []}; /* Petit preuve pour eviter redux */
    }
    componentDidMount() {
        fetch('/api/v1/eventsMobilizon')
        .then((response) => response.json())
        .then(eventsList=> {
          console.log(eventsList);
          this.setState({ events: eventsList });
          this.transformEvents()
        });
    }
    transformEvents(){
        for(var item of events){
          console.log(item);
        }
    }

    render() {
       
        const events = this.state.events.map((item, i) => (
            <div key={i}>
              <h1>{ item.title } { item.organizerActor.name }</h1>
            </div>
          ));

      
          return (
            <div id="layout-content" className="layout-content-wrapper">
              <div className="panel-list">{ events }</div> 
              <BigCalendar 
                localizer={localizer}
                events= { [
                    { 
                      "id": 0,
                      "title": 'Titre essai',
                      "start": new Date(2022,5,24,13,13,13),
                      "end": new Date(2022,5,25,13,13,13),
                      
                    },


                    ]	}
              
                step ={60}
                defaultDate= {new Date()}			
                style={{ height: 500 }}

             />
            </div>
          );
     }
 }
 
 export default EventsCalendar;
 
