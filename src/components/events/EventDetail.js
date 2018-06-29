import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSingleEvent } from './reducers';
import { loadEvent, updateEventAttendants } from './actions';
import AddEvent from './AddEvent';
import { getUserProfile } from '../profile/reducers';
import { loadUserProfile, queryProfile } from '../profile/actions';
import { getUser } from '../auth/reducers';
import { Link } from 'react-router-dom';
import ProfileList from '../profile/ProfileList';
import styles from './EventDetail.css';



class EventDetail extends Component {

  state = {
    editing: false,
    canEdit: false,
    nonAttendee: true
  };

  static propTypes = {
    loadUserProfile: PropTypes.func.isRequired,
    queryProfile: PropTypes.func.isRequired,
    user: PropTypes.object,
    userProfile: PropTypes.object,
    match: PropTypes.object,
    loadEvent: PropTypes.func.isRequired,
    singleEvent: PropTypes.object.isRequired,
    updateEventAttendants: PropTypes.func.isRequired
  };

  handleJoin = () => {
    const { singleEvent, userProfile, updateEventAttendants, loadEvent, match } = this.props;
    const profileIds = singleEvent.attendance.map(attendee => attendee._id);
    const updatedAttendants = {
      _id: this.props.singleEvent._id,
      attendance: [...profileIds, userProfile._id]
    };
    updateEventAttendants(updatedAttendants)
      .then(() => loadEvent(match.params.id));
  };

  handleEdit = () => {
    this.setState({ editing: true });
  };

  handleCancel = () => {
    this.setState({ editing: false });
  };
  
  componentDidMount() {
    const { loadEvent, match } = this.props;
    

    if(this.props.user !== null) {
      this.props.queryProfile(this.props.user._id)
        .then(({ payload }) => {
          return this.props.loadUserProfile(payload[0]._id);
        })
        .then(({ payload }) => {
          loadEvent(match.params.id)
            .then(event => {
              if(payload._id === event.payload.host[0]._id) {
                this.setState({
                  ...this.state,
                  canEdit: true
                });
              }
              const isGoing = event.payload.attendance.filter(a => a._id === payload._id);
              if(isGoing.length) {
                this.setState({
                  ...this.state,
                  nonAttendee: false
                });
              }

            });
        });
    }
    


  }

  render() {
    if(!this.props.singleEvent._id) return null;
    const { editing, canEdit, nonAttendee } = this.state;
    const { attendance, description, group, host, location, name, time, type, _id } = this.props.singleEvent;

    const { start, end } = time;

    const timeStart = new Date(start);
    const timeEnd = new Date(end);

    return (
      <div className={styles.eventDetail}>
        <h2>{name}</h2>
        {canEdit && <div>
          {editing || <button onClick={this.handleEdit}>✐</button>} </div>}
        {nonAttendee && <button onClick={this.handleJoin}>Join</button>}
        {editing && <AddEvent editing={editing} id={_id} />}
        {/* {host[0].userId.name ? <p>Hosted by: {host[0].userId.name} </p> : null} */}
        {/* {group.length ? <p>Team: {group}</p> : null} */}
        <p><span className="heading">Activity: </span>{type}</p>
        <p><span className="heading">Description: </span>{description}</p>
        <p><span className="heading">Address: </span>{location.name}</p>
        <p><span className="heading">Event Start: </span><span className="styled">{timeStart.toLocaleString()}</span></p>
        <p><span className="heading">Event End: </span><span className="styled">{timeEnd.toLocaleString()}</span></p>
        <div className="attendance">
          {attendance && <ProfileList profiles={attendance}/>}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: getUser(state),
    userProfile: getUserProfile(state),
    singleEvent: getSingleEvent(state)
  }),
  { loadEvent, queryProfile, updateEventAttendants, loadUserProfile }
)(EventDetail);