import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfile, getUserProfile } from './reducers';
import { loadProfile, updateProfile, queryProfile, loadUserProfile } from './actions';
import { getUser } from '../auth/reducers';
import { Link } from 'react-router-dom';
import ProfileForm  from './ProfileForm';
import styles from './Profile.css';

class Profile extends Component {

  state = {
    editing: false
  };

    static propTypes = {
      id: PropTypes.string,
      user: PropTypes.object,
      userProfile: PropTypes.object,
      match: PropTypes.object,
      loadProfile: PropTypes.func.isRequired,
      queryProfile: PropTypes.func.isRequired,
      loadUserProfile: PropTypes.func.isRequired,
      profile: PropTypes.object,
      updateProfile: PropTypes.func
    };

    componentDidMount() {
      if(this.props.id === this.props.userProfile._id) this.props.loadProfile(this.props.userProfile._id);
      this.props.loadProfile(this.props.id);
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

    // componentDidUpdate(prevProps) {
    //   if(this.props.profile !== prevProps.profile) {
    //     this.fetchData(this.props.profile);
    //   }
    // }

    render() {

      const { editing } = this.state;
      const { profile } = this.props;

      const { activities, bio, events, demographic, location, image, userId } = profile;
      if(!events) return null;

      return (
        <div className = {styles.profile}>
          <h1>{userId.name}</h1>
          <div className="profile-image">{image ? <img src = {image}/> : <img src="https://harrell-remodeling.com/wp-content/uploads/2017/09/Person-placeholder.jpg"/>}</div>
          <div className="profile-edit">{editing || <button onClick={this.handleEdit}>Edit Profile</button>}</div>
          { editing &&
          <ProfileForm 
            label="update profile"
            profile={profile}
            onComplete={updateProfile}
            onCancel={this.handleCancel}
          /> }
          <div className="personal-bio">
            {bio ? <p>About me:   {bio}</p> : <p>No bio added, tell us about yourself!</p> }
            {demographic ? <p>Gender: {demographic}</p> : <p>blank</p>}
            {location ? <p>Location: {location}</p> : <p>Fill in your location!</p>}
            {activities ? <p>{activities}</p> : <p>No activities added</p>}
            {events.map(event => <Link key={event._id} to={`/events/${event._id}`}>
          This is an event! Event called: {event.name}
            </Link>)}
          </div>

        </div>

      ); 
    } 
}

export default connect(
  state => ({ 
    user: getUser(state),
    profile: getProfile(state),
    userProfile: getUserProfile(state)
  }),
  { loadProfile, updateProfile, queryProfile, loadUserProfile }
)(Profile);

