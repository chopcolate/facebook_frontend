import { FaBirthdayCake, FaPen } from 'react-icons/fa';
import { BsFillPhoneFill, BsFillLightningChargeFill } from 'react-icons/bs';
import { ImProfile, ImKey, ImCamera } from 'react-icons/im';
import { GiSelfLove } from 'react-icons/gi';
import { TextField, Select, MenuItem, Input, Button } from '@mui/material'
import { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { URL } from '../../common/constants/constant';
import moment from 'moment';

import './Setting.scss';

function Setting() {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const [avatar, setAvatar] = useState(user.avatar);
    const [relation, setRelation] = useState(user.relation ? user.relation : "");
    const nameRef = useRef(user.name);
    const passwordRef = useRef("");
    const newPasswordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const stateRef = useRef("");
    const resultRef = useRef("");
    const birthdayRef = useRef(user.birthday);
    const relationRef = useRef(user.relation ? user.relation : "");
    const phoneRef = useRef(user.phone);
    const quoteRef = useRef(user.quote ? user.quote : "");
    const avatarRef = useRef(user.avatar);
    const handleRelation = (e) => {
        setRelation(e.target.value);
    }
    const uploadImage = (e) => {
        const previewURL = global.URL.createObjectURL(e.target.files[0]);
        setAvatar(previewURL);
    }
    const handleSubmit = () => {

        if(newPasswordRef.current.value != confirmPasswordRef.current.value) {
            resultRef.current.innerText = 'Vui lòng kiểm tra lại thông tin.';
            return;
        }

        const information = new FormData();
        avatarRef.current.files.length != 0 && information.append('avatar', avatarRef.current.files[0]);
        information.append('name', nameRef.current.value);
        information.append('password', passwordRef.current.value);
        information.append('newPassword', newPasswordRef.current.value);
        information.append('birthday', birthdayRef.current.value);
        information.append('phone', phoneRef.current.value);
        information.append('relation', relation);
        information.append('quote', quoteRef.current.value);

        fetch(`${URL.user}/update`, {
            method: 'POST',
            body: information,
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
        .then(res => res.text())
        .then(res => {
            if (res === 'success') {
                navigate('/');
            }
            else {
                resultRef.current.innerText = 'Vui lòng kiểm tra lại thông tin.';
                resultRef.current.style.color = 'red';
            }
        })
    }
    const checkPasswordMatch = (e) => {
        if (e.target.value === newPasswordRef.current.value) {
            stateRef.current.classList.add('valid');
            stateRef.current.classList.remove('invalid');
            stateRef.current.innerText = 'Password matches!';
        }
        else {
            stateRef.current.classList.add('invalid');
            stateRef.current.classList.remove('valid');
            stateRef.current.innerText = 'Password does not match!';
        }
    }

    return (
        <div className="setting">
            <img className="avatar" src={avatar} alt="avatar" />
            <label htmlFor="contained-button-file">
                <input ref={avatarRef} style={{ display: "none" }} id="contained-button-file" type="file" onChange={(e) => uploadImage(e)} />
                <Button component="span" className="upload-avatar">
                    <ImCamera className="icon" />
                </Button>
            </label>

            <ul className="text-info">
                <li className="text-item">
                    <ImProfile className="icon" />
                    <Input className="name" disabled={true} inputRef={nameRef} defaultValue={user.name} variant="filled" inputProps={{ style: { padding: 0, fontSize: "20px", backgroundColor: "white" } }} />
                </li>
                <li className="text-item">
                    <ImKey className="icon" />
                    <div className="password-group">
                        <Input inputRef={passwordRef} className="password2" type="password" placeholder='Old Password' variant="filled" inputProps={{ style: { padding: 0, fontSize: "18px", backgroundColor: "white" } }} />
                        <Input inputRef={newPasswordRef} className="password2" type="password" placeholder='New Password' variant="filled" inputProps={{ style: { padding: 0, fontSize: "18px", backgroundColor: "white" } }} />
                        <Input inputRef={confirmPasswordRef} className="password2" onInput={(e) => checkPasswordMatch(e)} type="password" placeholder='Confirm Password' variant="filled" inputProps={{ style: { padding: 0, fontSize: "18px", backgroundColor: "white" } }} />
                        <span ref={stateRef} className="state"></span>
                    </div>
                </li>
                <li className="text-item">
                    <FaBirthdayCake className="icon" />
                    <Input inputRef={birthdayRef} type="date" defaultValue={moment(user.birthday).format("YYYY-MM-DD")} className="birthdayInput" variant="filled" inputProps={{ style: { padding: 0, fontSize: "20px", backgroundColor: "white" } }} />
                </li>
                <li className="text-item">
                    <GiSelfLove className="icon" />
                    <Select
                        value={relation}
                        ref={relationRef}
                        onChange={(e) => handleRelation(e)}
                        variant="standard"
                        displayEmpty
                        inputProps={{
                            sx: {
                                fontSize: "20px",
                                backgroundColor: "#fff",
                                '&:hover': {
                                    backgroundColor: "#fff",
                                },
                                '&:focus': {
                                    backgroundColor: "#fff",
                                }
                            },
                        }}>
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="In a relationship">In a relationship</MenuItem>
                        <MenuItem value="Engaged">Engaged</MenuItem>
                    </Select>
                </li>
                <li className="text-item">
                    <BsFillPhoneFill className="icon" />
                    <Input inputRef={phoneRef} placeholder="Phone number" className="phone" defaultValue={user.phone} variant="filled" inputProps={{ style: { padding: 0, fontSize: "20px", backgroundColor: "white" } }} />
                </li>
                <li className="text-item">
                    <FaPen className="icon" />
                    <Input inputRef={quoteRef} placeholder="Hãy nói 1 câu đạo lý" multiline defaultValue={user.quote} variant="filled" inputProps={{ style: { padding: "0 !important", fontSize: "20px", backgroundColor: "white" } }} />
                </li>
            </ul>
            <button className="submit" onClick={() => handleSubmit()}>Save</button>
            <span ref={resultRef} className="state"></span>
        </div>
    );
}

export default Setting;