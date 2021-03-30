import {combineReducers} from 'redux';
import schemasReducer from './schemas';

export default combineReducers({
  schemas: schemasReducer,
});
