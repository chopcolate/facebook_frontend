
export const LOGGED_IN = "logged.in";
export const LOGGED_OUT = "logged.out";
export const REQUEST_LIST = "request.list";
export const NOTI_LIST = "noti.list";
export const FOLLOW = 'follow';
export const UNFOLLOW = 'unfollow';

export const loggedIn = (payload) => {
    return {
        type: LOGGED_IN,
        payload: payload
    }
}

export const loggedOut = (payload = null) => {
    return {
        type: LOGGED_OUT,
        payload: payload
    }
}

export const requestList = (payload = null) => {
    return {
        type: REQUEST_LIST,
        payload: payload
    }
}

export const notiList = (payload = null) => {
    return {
        type: NOTI_LIST,
        payload: payload
    }
}

export const follow = (payload) => {
    return {
        type: FOLLOW,
        payload: payload
    }
}

export const unfollow = (payload) => {
    return {
        type: UNFOLLOW,
        payload: payload
    }
}