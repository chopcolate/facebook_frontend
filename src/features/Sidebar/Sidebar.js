import { NavLink } from 'react-router-dom';
import { FaTemperatureLow } from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';
import { BsWind } from 'react-icons/bs'
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { RiPlayFill, RiPauseFill } from 'react-icons/ri';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { IoVolumeHigh } from 'react-icons/io5';
import { Slider } from '@mui/material';

import './Sidebar.scss';
import { useEffect, useState, memo, useRef } from 'react';
import { API } from '../../common/constants/constant';
import { play, pause, next, previous } from '../../common/redux/actions/player';
import discImg from '../../assets/images/disc.png';

function Sidebar() {
    const [weather, setWeather] = useState();
    const dispatch = useDispatch();
    const audioRef = useRef();
    const currentProgressRef = useRef();
    const currentTimeRef = useRef();
    const endTimeRef = useRef();
    const user = useSelector((state) => state.user);
    const player = useSelector((state) => state.player, shallowEqual);
    const handlePlaying = (time) => {
        let currentProgress = Math.floor((time.target.currentTime/audioRef.current.duration) * 100);
        currentTimeRef.current.innerText = `${Math.floor(time.target.currentTime/60) < 10 ? "0" + Math.floor(time.target.currentTime/60) : Math.floor(time.target.currentTime/60)}:${Math.ceil(time.target.currentTime % 60) < 10 ? "0" + Math.ceil(time.target.currentTime % 60) : Math.ceil(time.target.currentTime % 60)}`;
        currentProgressRef.current.value = currentProgress;
    }
    const seek = (e) => {
        audioRef.current.currentTime = (e.target.value * audioRef.current.duration) / 100;
    }
    const changeVolume = (e) => {
        audioRef.current.volume = e.target.value/100;
    }
    useEffect(() => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=Ho%20Chi%20Minh&units=metric&APPID=${API.WEATHER}`)
        .then(res => res.json())
        .then(res => setWeather(res))
    }, [])
    return ( 
        <div className="side-bar">
            <NavLink to={`/${user.username}`} className="information">
                <img className="avatar" src={user.avatar} alt="avatar" />
                <p className="name">{user.name}</p>
            </NavLink>
            <div className="player">
                <div className="player-info">
                    <img className="player-img" src={player.img ? player.img : discImg}/>
                    <div className="player-detail">
                        <p className="name">{player.title}</p>
                        <p className="artist">{player.artist}</p>
                    </div>
                </div>
                <div className="player-control">
                    <div className="player-button">
                        <MdSkipPrevious className="player-btn" onClick={() => dispatch(previous())}/>
                        {player.isPlaying && <RiPauseFill className="player-btn" onClick={() => { dispatch(pause()); audioRef.current.pause() }}/>}
                        {!player.isPlaying && <RiPlayFill className="player-btn" onClick={() => { dispatch(play()); audioRef.current.play() }}/>}
                        <MdSkipNext className="player-btn" onClick={() => dispatch(next())}/>
                        <div className="player-volume">
                            <IoVolumeHigh className="player-btn volume"/>
                            <Slider className="volume-bar" defaultValue={80} min={0} max={100} onChange={(e) => changeVolume(e)} orientation="vertical" variant="determinate" sx={{ width: "4px", height: "56px", position: "absolute", top: "-50px", "& .MuiSlider-rail": { color: "#fff" }, "& .MuiSlider-thumb": { width: "8px", height: "8px", color: "#fff" }}} />
                        </div>
                    </div>
                    <div className="player-progress">
                        <p className="current-time" ref={currentTimeRef}>00:00</p>
                        <input ref={currentProgressRef} type="range" className="progress-bar" defaultValue={0} min="0" max="100" onChange={e => seek(e)} />
                        <p className="end-time" ref={endTimeRef}>--:--</p>
                    </div>
                    <audio ref={audioRef} src={player.url} autoPlay onTimeUpdate={(e) => handlePlaying(e)} onPlay={() => endTimeRef.current.innerText = 
                                                                                                                        audioRef.current && audioRef.current.duration ? 
                                                                                                                        `${Math.floor(audioRef.current.duration/60) < 10 ? "0" + Math.floor(audioRef.current.duration/60) : 
                                                                                                                        Math.floor(audioRef.current.duration/60)}:${Math.ceil(audioRef.current.duration % 60) < 10 ? "0" + Math.ceil(audioRef.current.duration % 60) : 
                                                                                                                        Math.ceil(audioRef.current.duration % 60)}` : "--:--"}/>
                </div>
            </div>
            {weather && <div className="weather">
                <h1 className="city-name">{weather.name}</h1>
                <div className="weather-info">
                <img className="weather-img" src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
                    <h2 className="weather-text">{weather.weather[0].description}</h2>
                </div>
                <div className="weather-info temperature">
                    <FaTemperatureLow className="weather-icon temperature"/>
                    <div className="detail">
                        <h3>Now: {weather.main.temp}°</h3>
                        <h3>Feels Like: {weather.main.feels_like}°</h3>
                        <h3>L: {weather.main.temp_min}° - H: {weather.main.temp_max}°</h3>
                    </div>
                </div>
                <div className="weather-info humidity">
                    <WiHumidity className="weather-icon humidity" />
                    <h3>{weather.main.humidity} %</h3>   
                </div>
                      
                <div className="weather-info wind">
                    <BsWind className="weather-icon wind" />
                    <h3>{weather.wind.speed} km/h</h3>
                </div>     
                
            </div>}
        </div>
    );
}

export default memo(Sidebar);