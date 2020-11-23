import { combineReducers } from 'redux';
import dayPartTrackerReducer from './dayPartTracker';
import daysTrackerReducer from './daysTracker';

export default combineReducers({
    dayPart: dayPartTrackerReducer,
    days: daysTrackerReducer,
});