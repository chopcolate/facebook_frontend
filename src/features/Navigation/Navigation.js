
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';
import { BsFillPlayBtnFill, BsMessenger } from 'react-icons/bs';
import { IoNotifications, IoSettings } from 'react-icons/io5';
import { HiDotsHorizontal } from 'react-icons/hi';
import { CgLogOut, CgProfile } from 'react-icons/cg';
import './Navigation.scss';
import { useState, useEffect, useRef, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { URL } from '../../common/constants/constant';
import { seeProfile } from '../../common/redux/actions/action';
import { loggedOut, requestList as requestListFnc, notiList as notiListFnc } from '../../common/redux/actions/user';
import { Popup } from '../index';


function Navigation() {
    const dispatch = useDispatch();
    const getRequestList = useRef();
    const getNotiList = useRef();
    const [showProfile, setShowProfile] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const avatar = useSelector(state => state.user.avatar);
    const user = useSelector(state => state.user);
    const [requestList, setRequestList] = useState(user.requests);
    const [notiList, setNotiList] = useState(user.notifications);
    const handleSearch = (e) => {
        if (e.target.value == '') {
            setSearchResult([]);
            return;
        }
        fetch(`${URL.user}/search?keyword=${e.target.value}`, {
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
        .then(response => response.json())
        .then(response => setSearchResult(response))
    }

    useEffect (() => {
        if (user) {
            user.socket.emit('sendRequestList', user.username);
            getRequestList.current = setInterval(() => {
                user.socket.emit('sendRequestList', user.username);
            }, 5000)
        }
        return () => {
            clearInterval(getRequestList.current);
        }
    }, [])

    useEffect(() => {
        user.socket.on('receiveRequestList', (message) => {
            if (!message.every((item) => user.requests.includes(item))) {
                setRequestList(message);
                dispatch(requestListFnc(message));
            }

        })
        return () => {
            user.socket.off('receiveRequestList')
        }
    }, [])

    useEffect (() => {
        if (user) {
            user.socket.emit('sendNotiList', user.username);
            getNotiList.current = setInterval(() => {
                user.socket.emit('sendNotiList', user.username);
            }, 5000)
        }
        return () => {
            clearInterval(getNotiList.current);
        }
    }, [])

    useEffect(() => {
        user.socket.on('receiveNotiList', (message) => {
            if (!message.every((item) => user.notifications.includes(item))) {
                setNotiList(message);
                dispatch(notiListFnc(message));
            }

        })
        return () => {
            user.socket.off('receiveNotiList')
        }
    }, [])

    return ( 
        <div className="nav-bar">
            <div className="nav-item left">
                <NavLink className="logo" to="/"> Chopcolate </NavLink>
            </div>

            <div className="nav-item middle">
                <NavLink className="link-item" to="/"> <AiFillHome className /> </NavLink>
                <NavLink className="link-item" to="/friends"> <FaUserFriends/> {requestList ? requestList.length > 0 && <p className='number'>{requestList.length}</p> : null }</NavLink>
                <NavLink className="link-item" to="/watch"> <BsFillPlayBtnFill/> </NavLink>
                <div className="link-item" onClick={() => setShowPopup(!showPopup)}> 
                    <IoNotifications /> 
                    {notiList ? notiList.length > 0 && <p className='number'>{notiList.length}</p> : null }
                    
                    { showPopup && <Popup children={notiList} /> }
                </div>
            </div>

            <div className="nav-item right">
                <div className="search-bar">
                    <input className="search" type="text" placeholder="Search" onInput={(e) => handleSearch(e)} />
                    {
                        searchResult.length != 0 && <div className="search-results">
                            {
                                searchResult.map((item, index) => {
                                    return (
                                        <NavLink onClick={() => dispatch(seeProfile(item))} to={`/${item.username}`} className="search-item" key={index}>
                                            <img className="avatar" src={item.avatar} />
                                            <p>{item.username}</p>
                                        </NavLink>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                <div className="profile">
                    <img className="avatar" src={avatar} alt="avatar" onClick={() => setShowProfile(!showProfile)} />
                    { showProfile && <ul className="list">
                        <NavLink onClick={() => dispatch(seeProfile(user))} to={`/${user.username}`} className="list-item">
                            <CgProfile className="icon" />
                            <span>Profile</span>
                        </NavLink>
                        <NavLink to="/setting" className="list-item">
                            <IoSettings className="icon" />
                            <span>Setting</span>
                        </NavLink>
                        <NavLink to="/auth/login" onClick={() => dispatch(loggedOut())} className="list-item">
                            <CgLogOut className="icon" />
                            <span>Logout</span>
                        </NavLink>
                    </ul> }
                </div>
            </div>
        </div>
    );
}

export default memo(Navigation);