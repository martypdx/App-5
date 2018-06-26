import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from './promise-middleware';
import { user, checkedAuth } from '../components/auth/reducers';
import { error, loading } from '../components/app/reducers';
import { profile } from '../components/profile/reducers';
import { groups, group } from '../components/groups/reducers';
import { events, event } from '../components/events/reducers';

const rootReducer = combineReducers({
  error,
  loading,
  profile,
  groups,
  group,
  events,
  event,
  user,
  checkedAuth
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunk,
      promiseMiddleware
    )
  )
);

export default store;
