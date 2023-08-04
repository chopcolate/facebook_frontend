import { FaBirthdayCake, FaPen } from 'react-icons/fa';
import { BsFillPhoneFill, BsFillLightningChargeFill } from 'react-icons/bs';
import { GiSelfLove } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { follow as followFunc, unfollow as unfollowFunc } from '../../common/redux/actions/user';
import { URL } from '../../common/constants/constant';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { Post } from '../index';

import './Profile.scss';

function Profile() {
    const location = useLocation();
    const dispatch = useDispatch();
    const [profile, setProfile] = useState();
    const user = useSelector(state => state.user);
    const [follow, setFollow] = useState(false);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${URL.user}/getUser${location.pathname}`, {
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
            .then(res => res.json())
            .then(res => {
                setProfile(res);
                setPosts(res.posts);
                user.contacts.includes(res.username) ? setFollow(true) : setFollow(false);
            });
    }, []);

    // useEffect(() => {
    //     const getPosts = async () => {
    //         return await fetch(URL.user, {
    //             headers: {
    //                 'Authorization': `Bearer ${user.access_token}`,
    //             }
    //         })                            
    //         .then(res => res.json())
    //         .then(data => {
    //             setPosts(data);
    //         })
    //     }
    //     getPosts();
    // }, [])

    const handleFollowBtn = () => {
        if (!follow) {
            dispatch(followFunc(profile.name));
        }
        else {
            dispatch(unfollowFunc(profile.name));
        }
        setFollow(!follow);
        fetch(`${URL.user}/follow/${profile.username}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
    }

    if (!profile) return <>Loading</>
    return (
        <>
            <div className="user-profile">
                <img className="avatar" src={profile.avatar} alt="avatar" />
                <ul className="text-info">
                    <li className="text-item">
                        <p className="name">{profile.name}</p>
                    </li>
                    <li className="text-item">
                        <FaBirthdayCake className="icon" />
                        <p className="birthday">{moment(profile.birthday).format("MMMM-DD-YYYY")}</p>
                    </li>
                    <li className="text-item">
                        <GiSelfLove className="icon" />
                        <p className="relationship">{profile.relation}</p>
                    </li>
                    <li className="text-item">
                        <BsFillPhoneFill className="icon" />
                        <p className="phone">{profile.phone}</p>
                    </li>
                    <li className="text-item">
                        <BsFillLightningChargeFill className="icon" />
                        <p className="follow">{`Followed by ${profile.contacts.length} people`}</p>
                    </li>
                    <li className="text-item">
                        <FaPen className="icon" />
                        <p className="quote">{profile.quote}</p>
                    </li>
                </ul>
                <button className="action" onClick={() => handleFollowBtn()}>
                    {follow ? "Unfollow" : "Follow"}
                </button>
            </div>
            <div className="post-area">
                <Post postList={posts}/>
            </div>

        </>
    );
}

export default Profile;