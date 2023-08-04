import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { URL } from '../../common/constants/constant';
import './Friends.scss';
import { NavLink } from 'react-router-dom';
import { seeProfile } from '../../common/redux/actions/action';
import { follow as followFunc } from '../../common/redux/actions/user';


function Friends() {
    const user = useSelector(state => state.user);
    const [requests, setRequests] = useState([]);
    const followBtnRef = useRef([]);
    const dispatch = useDispatch();
    const handleFollowBtn = (profile, index) => {
        followBtnRef.current[index].innerText = 'Followed';
        followBtnRef.current[index].disabled = true;
        dispatch(followFunc(profile.name));
        fetch(`${URL.user}/follow/${profile.username}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
    }
    useEffect(() => {
        fetch(`${URL.user}/requests`, {
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
        .then(res => res.json())
        .then(res => setRequests(res));
    }, []);
    
    return (  
        <>
            <div className="friend-requests">
            {
                requests.map((request, index) => {
                    return (
                        <li className="request" key={index}>
                            <img className="request-img" src={request.avatar}/>
                            <p className="request-name">{request.name}</p>
                            <NavLink className="detail" to={`/${request.username}`} onClick={() => dispatch(seeProfile(request))}>Detail</NavLink>
                            <button ref={ref => followBtnRef.current.push(ref)} className="action" onClick={() => handleFollowBtn(request, index)}>Follow</button>
                        </li>

                    )
                })
            }
            </div>
        </>
    );
}

export default Friends;