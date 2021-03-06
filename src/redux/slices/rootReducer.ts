import {combineReducers} from 'redux';
import dayPartInputReducer from './dayPartInput';
import daysTrackerReducer from './daysTracker';

export default combineReducers({
  dayPart: dayPartInputReducer,
  days: daysTrackerReducer,
});
