

import './Watch.scss';
import { useQuery } from 'react-query';
import { URL } from '../../common/constants/constant';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { play } from '../../common/redux/actions/player';

function Watch() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [medias, setMedias] = useState([]);
    const getMedia = () => {
        return fetch(`${URL.media}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.access_token}`,
                    }
                })
                .then((res) => res.json());
    }
    const { data, isLoading } = useQuery('getMedia', getMedia, {
        refetchOnWindowFocus: false
    })
    const selectSong = (song, index) => {
        const payload = {
            title: song.name,
            index: index,
            url: song.url,
            img: song.img,
            artist: song.artist,
            list: medias
        }
        dispatch(play(payload));
    }
    useEffect(() => {
        if (data) {
            setMedias(data);
        }
    }, [data])
    if (isLoading) {
        return <p>Loading</p>
    }
    return (
        <div className="watch">
            <div className="audio">
                <h3 className="title">Audio</h3>
                <ul className="audio-list">
                    {
                        medias && medias.map((media, index) => {
                            return (
                                <li className="audio-item" key={index} onClick={() => selectSong(media, index)}>
                                    <img className="audio-img" src={media.img} />
                                    <div className="audio-info">
                                        <p className="name">{media.name}</p>
                                        <p className="artist">{media.artist}</p>
                                    </div>
                                </li>
                            )
                        })
                    }

                </ul>
            </div>
        </div>
    );
}

export default Watch;