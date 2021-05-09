import {combineReducers} from 'redux';
import updateUIReducer from './updateUI';

export default combineReducers({
  updateUI: updateUIReducer,
});
