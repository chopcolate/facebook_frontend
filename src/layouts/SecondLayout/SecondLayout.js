
import { useRef, useState, useEffect } from 'react'
import { URL } from '../../common/constants/constant';
import { useNavigate, NavLink } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { loggedIn } from '../../common/redux/actions/user';

import './SecondLayout.scss';


function SecondLayout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isRegister = children.isRegister;
    const usernameRef = useRef();
    const nameRef = useRef();
    const passwordRef = useRef();
    const statusRef = useRef();
    const emailRef = useRef();
    const birthdayRef = useRef();
    const socket = useRef();
    const confirmPasswordRef = useRef();
    const [matchPassword, setMatchPassword] = useState(true);

    const checkPassword = (e) => {
        setMatchPassword(confirmPasswordRef.current.value === e.target.value);
    }

    const checkConfirmPassword = (e) => {
        setMatchPassword(passwordRef.current.value === e.target.value);
    }

    useEffect(() => {
        if (!matchPassword) {
            statusRef.current.style.color = 'red';
            statusRef.current.innerText = "Password doesn't match";
        }
        else {
            statusRef.current.innerText = "";
        }
    }, [matchPassword]);

    const submitForm = (user) => {
        if (isRegister && matchPassword) {
            fetch(URL.auth + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then((res) => {
                if (res.status === 201) {
                    navigate('/auth/login');
                }
                else {
                    statusRef.current.innerHTML = 'Username already exists';
                }
            })
        }
        else {
            fetch(URL.auth + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then((res) => {
                    if (res.status == 401) {
                        statusRef.current.style.color = 'red';
                        statusRef.current.innerText = 'Wrong username or password!!';
                        return;
                    }
                    else {
                        return res.json();
                    }
            })
            .then(user => {
                if (!user) {
                    return;
                }
                socket.current = io(URL.socket, { query: `username=${user.username}` });
                user.socket = socket.current;
                dispatch(loggedIn(user));
                statusRef.current.style.color = 'green';
                statusRef.current.innerHTML = "Login success!! Redirecting...";
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 500);
            }) 
        }
    }

    return (
        <div className="authentication">
            <div className="auth">
                <div className="auth-select">
                    <h1 className="logo">Chopcolate</h1>
                    <div className="options">
                        <NavLink to='../auth/login' className="option">Sign In</NavLink>
                        <div className="line"></div>
                        <NavLink to="../auth/register" className="option">Sign Up</NavLink>
                    </div>
                </div>
                {!isRegister && <div className="form">
                    <div className="input-wrapper username">
                        <input ref={usernameRef} type="text" placeholder="Username" />
                    </div>
                    <div className="input-wrapper password">
                        <input ref={passwordRef} type="password" placeholder="Password" />
                    </div>

                    <span ref={statusRef} className="status"></span>

                    <button className="login" onClick={() => submitForm({
                        username: usernameRef.current.value,
                        password: passwordRef.current.value,
                    })}>Log in</button>
                </div>}

                {isRegister && <div className="form">
                    <div className="input-wrapper username">
                        <input ref={usernameRef} type="text" placeholder="Username" />
                    </div>
                    <div className="input-wrapper fullname">
                        <input ref={nameRef} type="text" placeholder="Fullname" />
                    </div>
                    <div className="input-wrapper email">
                        <input ref={emailRef} type="text" placeholder="Email" />
                    </div>
                    <div className="input-wrapper birthday">
                        <TextField inputRef={birthdayRef} type="date" className="birthdayInput" variant="filled" InputProps={{disableUnderline: true}} inputProps={{style : { padding: 0 }}} />
                    </div>
                    <div className="input-wrapper password">
                        <input ref={passwordRef} type="password" placeholder="Password" onInput={(e) => checkPassword(e)} />
                    </div>
                    <div className="input-wrapper confirmPassword">
                        <input ref={confirmPasswordRef} type="password" placeholder="Re-enter Password" onInput={(e) => checkConfirmPassword(e)} />
                    </div>

                    <span ref={statusRef} className="status"></span>

                    <button className="register" onClick={() => submitForm({
                        username: usernameRef.current.value,
                        name: nameRef.current.value,
                        password: passwordRef.current.value,
                        email: emailRef.current.value,
                        birthday: new Date(birthdayRef.current.value),
                    })}>Register</button>
                </div>}
            </div>

        </div>
    );
}

export default SecondLayout;