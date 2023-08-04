import { OPEN_CHAT, CLOSE_CHAT, SEE_PROFILE } from "../../actions/action";
import { LOGGED_OUT } from "../../actions/user";

const userActionInit = {
    closeChat: null,
    profile: null,
}

const actionReducer = ( state = userActionInit, action ) => {
    const newState = {...state};
    switch(action.type) {
        case LOGGED_OUT:
            return userActionInit;
        case OPEN_CHAT: 
            newState.closeChat = null;
            return newState;
        case CLOSE_CHAT:
            newState.closeChat = action.payload;
            return newState;
        case SEE_PROFILE:
            newState.profile = action.payload;
            return newState;
        default:
            return state;
    }
}

export default actionReducer;