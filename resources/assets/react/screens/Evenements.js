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
import {
	Modal,
	ModalBody,
	ModalHeader,
	Label,
} from 'reactstrap';
const localizer = BigCalendar.momentLocalizer(moment); 

let  views = Object.keys(Views).map((k) => Views[k]);

@connect(store => ({
  assos: store.getData('user/assos'),

}))

class EventsCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          newEvents: [],
          modal: {
            isOpened : false,
            title: "", 
            description: "",
            start : "",
            end: "", 
            organizer: "",
            url: ""
          }
          
        };   

    }
    loadGeneralCalendar(){

      fetch('/api/v1/eventsMobilizon')
      .then((response) => response.json())
      .then(eventsList=> {
        
        const newEventsList = eventsList.map(function(item) {
          return {
              title: item.title, 
              start : new Date(item.beginsOn), 
              end : new Date(item.endsOn), 
              url: item.url,
              description: item.description,
              organizer: item.organizerActor            
            }    
        });

        this.setState({newEvents: newEventsList});
      });
    }
    componentDidMount() {
       this.loadGeneralCalendar(); 
    }
    loadEventsUser(){
     
      const eventsAsso = []
      /* Iteration of all user's assos in order to send the shortname 
      to the API, in every API call we will be pushing the results into eventsAsso 
      at the end we set the state of newEvents with eventsAsso
      */
      this.props.assos.map(function(item){
        fetch('/api/v1/eventsMobilizon/'+(item.shortname)
          .replaceAll(" ", "_")
          .replaceAll(".", "")
          .replaceAll("-", "")
          .replaceAll(",", "")
          .replaceAll("'", "")
          .toLowerCase())
        .then((response) => response.json())
        .then(eventsList=> {
          eventsList.map(function(item) {
            eventsAsso.push({
              title: item.title, 
              start : new Date(item.beginsOn), 
              end : new Date(item.endsOn), 
              url: item.url,
              description: item.description,
              organizer: item.organizerActor
            });
          });
       
        });        
      });  

      this.setState({newEvents: eventsAsso});    

    }
    /*MODAL*/
    toggle(e) {
      this.setState({isOpened:true});
      this.setState({title: e.title});
      this.setState({description: e.description.replaceAll("<p>", "").replaceAll("</p>", "")});
      this.setState({url: e.url});
      this.setState({start: e.start.toString()})
      this.setState({end: e.end.toString()})
      
      if(e.organizer !=null){
        this.setState({organizer: e.organizer.name});
      }
    }
    closeModal() {
      this.setState({isOpened:false});
    }

    render() {  
          return (
            
            <div style={{margin:50}}>
              <h1 style={{marginBottom: 20}}>Calendrier général des évènements</h1>
              <Button color="primary" outline onClick={this.loadEventsUser.bind(this)} style={{marginBottom: 30, marginTop:30, marginRight:30}}>
                Calendrier mes assos
					    </Button>
              <Button color="secondary" outline onClick={this.loadGeneralCalendar.bind(this)} style={{marginBottom: 30, marginTop:30}}>
                Calendrier général
					    </Button>

              <BigCalendar 
                localizer={localizer}
                events= {this.state.newEvents}
                step ={60}
                defaultDate= {new Date()}			
                style={{ height: 700 }}
                onSelectEvent={(e) => this.toggle(e)}
                popup={true}
              />

              <Modal className="modal-dialog-extended" isOpen={this.state.isOpened} style={{width:"60%"}}>
                <ModalHeader toggle={(e)=>this.closeModal()} style={{padding:20}}>
                  <b>Nom </b>{this.state.title}
                </ModalHeader>
                <ModalBody style={{padding:20}}>
                  {
                  this.state.description ? 
                    <div style={{marginBottom: 20}}><Label><b>Description</b></Label><br/>{this.state.description}</div>:
                    <div></div>
                  }
                 
                  {
                  this.state.organizer ? 
                    <div style={{marginBottom: 20}}><Label><b>Organisateur</b></Label><br/>{this.state.organizer}</div>:
                    <div></div>
                  }
                  <div style={{marginBottom: 20}}>
                    <Label><b>Date de début</b></Label><br/>
                    {this.state.start}
                  </div>
                  <div style={{marginBottom: 20}}>
                    <Label><b>Date de fin</b></Label><br/>
                    {this.state.end}
                  </div>
                  
                  <div style={{marginBottom: 20}}>
                    <Label><b>URL</b></Label><br/>
                    <a href={this.state.url}> {this.state.url}</a>
                  </div>
              
                </ModalBody>
              </Modal>
            

            </div>
          );
     }
 }
 
 export default EventsCalendar;
 
