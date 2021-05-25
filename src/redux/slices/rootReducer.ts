import {combineReducers} from 'redux';
import updateUIReducer from './uiManagement/updateUI';

export default combineReducers({
  updateUI: updateUIReducer,
});
