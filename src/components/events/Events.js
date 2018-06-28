import React, { Component } from 'react';
import EventsList from './EventsList';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import AddEvent from './AddEvent';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadEvents } from './actions';
import { getEvents } from './reducers';
import MapContainer from './MapContainer';
import EventDetail from './EventDetail';
import styles from './Events.css';


class Events extends Component {

  static propTypes = {
    loadEvents: PropTypes.func.isRequired,
    events: PropTypes.array
  };

  componentDidMount() {
    this.props.loadEvents();
  }

  state = {
    portland: {
      lat: 45.51,
      lng: -122.65
    }
  };

  render() {
    const { events } = this.props;
    if(!events) return null;

    return (
      <div>
        <h2>Events</h2>
        <ul className = {styles}>
          <li><Link to={'/events/list'}>All Events</Link></li>
          <li><Link to={'/events/new'}>Add a New Event</Link></li>
          <li><Link to={'/events/map'}>Map View</Link></li>
        </ul>
        <Switch>
          <Route exact path={'/events/list'} render={() => {return <EventsList events={events}/>;}} />
          <Route path={'/events/new'} render={() => {return <AddEvent/>;}} />
          <Route path={'/events/map'} render={() => {return <MapContainer defaultCoords={this.state.portland} events={events}/>;}} />
          <Route exact path="/events/:id" component={EventDetail}/>
          <Redirect to="/events/map"/>
        </Switch>
      </div>
    );
  } 
}

export default connect(
  state => ({ events: getEvents(state) }),
  { loadEvents }
)(Events);