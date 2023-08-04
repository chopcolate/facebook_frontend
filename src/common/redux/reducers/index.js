import userReducer from './user/user';
import actionReducer from './action/action';
import playerReducer from './player/player';
import { combineReducers } from 'redux';

const reducer = combineReducers({user: userReducer, action: actionReducer, player: playerReducer});
export default reducer;