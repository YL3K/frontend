import { combineReducers } from 'redux';
import userReducer from './userReducer';
import fcmTokenReducer from './fcmTokenReducer';

const rootReducer = combineReducers({
  user: userReducer,
  fcmToken: fcmTokenReducer,
});

export default rootReducer;