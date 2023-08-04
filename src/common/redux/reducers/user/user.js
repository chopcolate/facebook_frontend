import { LOGGED_IN, LOGGED_OUT, REQUEST_LIST, FOLLOW, UNFOLLOW } from "../../actions/user";
import _  from "lodash";

const userReducer = ( state = null, action ) => {
    const newState = state;
    switch (action.type) {
        case LOGGED_IN:
            return action.payload;
        case LOGGED_OUT:
            return null;
        case REQUEST_LIST:
            newState.requests = action.payload;
            return newState;
        case FOLLOW:
            newState.contacts.push(action.payload);
            newState.requests = _.pull(newState.requests, action.payload);
            return newState;
        case UNFOLLOW:
            newState.contacts = _.pull(newState.contacts, action.payload);
            return newState;
        default: 
            return state;
    }
}

export default userReducer;