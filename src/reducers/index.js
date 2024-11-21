import { combineReducers } from 'redux';
import userReducer from './userReducer';
import fcmTokenReducer from './fcmTokenReducer';
import counselReducer from './counselReducer';

const rootReducer = combineReducers({
  user: userReducer,
  fcmToken: fcmTokenReducer,
  counsel: counselReducer
});

export default rootReducer;