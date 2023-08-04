import { PLAY, PAUSE, NEXT, PREVIOUS } from "../../actions/player"

const init = {
    isPlaying: false,
    title: "",
    index: 0,
    url: "",
    artist: "",
    list: "",
    img: null,
}


const playerReducer = (state = init, action) => {
    let newState = {...state};
    switch (action.type) {
        case PLAY:
            
            newState = action.payload ? {   isPlaying: true,
                                            title: action.payload.title,
                                            index: action.payload.index,
                                            url: action.payload.url,
                                            artist: action.payload.artist,
                                            list: action.payload.list,
                                            img: action.payload.img,
                                        }
                                        : {
                                            ...newState,
                                            isPlaying: true
                                        }
            return newState;
        case PAUSE:
            return {
                ...state,
                isPlaying: false
            }
        case NEXT:
            if (newState.index == newState.list.length-1) {
                newState.index = -1;
            }
            ++newState.index;
            newState.title = newState.list[newState.index].name;
            newState.url = newState.list[newState.index].url;
            newState.artist = newState.list[newState.index].artist;
            newState.img = newState.list[newState.index].img;
            return newState;
        case PREVIOUS:
            if (newState.index == 0) {
                newState.index = newState.list.length;
            }
            --newState.index;
            newState.title = newState.list[newState.index].name;
            newState.url = newState.list[newState.index].url;
            newState.artist = newState.list[newState.index].artist;
            newState.img = newState.list[newState.index].img;
            return newState;
        default:
            return state;
    }
}

export default playerReducer;