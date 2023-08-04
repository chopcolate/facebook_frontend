export const PLAY = 'play';
export const PAUSE = 'pause';
export const NEXT = 'next';
export const PREVIOUS = 'previous';

export const play = (payload) => {
    return {
        type: PLAY,
        payload
    }
}

export const pause = (payload) => {
    return {
        type: PAUSE,
        payload
    }
}

export const next = (payload) => {
    return {
        type: NEXT,
        payload
    }
}

export const previous = (payload) => {
    return {
        type: PREVIOUS,
        payload
    }
}