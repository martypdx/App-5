import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfile } from './reducers';
import { loadProfile, updateProfile } from './actions';
import { getUser } from '../auth/reducers';
import { Link } from 'react-router-dom';
import ProfileForm  from './ProfileForm';

class Profile extends Component {

  state = {
    editing: false
  };

    static propTypes = {
      user: PropTypes.object,
      match: PropTypes.object,
      loadProfile: PropTypes.func.isRequired,
      profile: PropTypes.object,
      updateProfile: PropTypes.func.isRequired
    };

    componentDidMount() {
      console.log('PROFILE', this.props.user);
      this.props.loadProfile(this.props.match.params.id);

    }

    handleEdit = () => {
      this.setState({ editing: true });
    };
  
    handleCancel = () => {
      this.setState({ editing: false });
    };
  
    handleUpdate = data => {
      this.props.updateProfile(data);
      this.setState({ editing: false });
    };

    render() {

      const { editing } = this.state;
    
      const { activities, bio, events, demographic, location, image, userId } = this.props.profile;
      if(!events) return null;

      return (
        <div>
          { editing &&
          <ProfileForm label="update profile"
            onComplete={updateProfile} onCancel={this.handleCancel}
          /> }
          {editing || <button onClick={this.handleEdit}>✐</button>}
          <h1>This is a Profile Component</h1>
          <h1>{userId.name}</h1>
          {image ? <img src = {image}/> : <p>Add an image</p>}
          {bio ? <p>This is me:{bio}</p> : <p>No bio added, tell us about yourself!</p> }
          {demographic ? <p>demographic:{demographic}</p> : <p>blank</p>}
          {location ? <p>Location: {location}</p> : <p>Fill in your location!</p>}
          {activities ? <p>{activities}</p> : <p>No activities added</p>}
          {events.map(event => <Link key={event._id} to={`/events/${event._id}`}>
          This is an event! Event called: {event.name}
          </Link>)}

        </div>

      ); 
    } 
}

export default connect(
  state => ({ 
    user: getUser(state),
    profile: getProfile(state) 
  }),
  { loadProfile }
)(Profile);

