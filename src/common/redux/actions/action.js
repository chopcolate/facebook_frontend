export const OPEN_CHAT = 'open.chat';
export const CLOSE_CHAT = 'close.chat';
export const SEE_PROFILE = 'see.profile';

export const openChat = (payload) => {
    return {
        type: OPEN_CHAT,
        payload
    }
}

export const closeChat = (payload) => {
    return {
        type: CLOSE_CHAT,
        payload
    }
}

export const seeProfile = (payload) => {
    return {
        type: SEE_PROFILE,
        payload
    }
}

