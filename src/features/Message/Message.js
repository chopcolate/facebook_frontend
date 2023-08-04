import './Message.scss';
import { useEffect, useRef, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCloseSharp, IoSendSharp } from 'react-icons/io5';
import { closeChat } from '../../common/redux/actions/action';
import { URL } from '../../common/constants/constant';

function Message( {partner} ) {
    const user = useSelector(state => state.user);
    const socket = user.socket;
    const dispatch = useDispatch();
    const toSocketId = partner.socketId;
    const [messages, setMessages] = useState([]);
    const messageInputRef = useRef();
    const messageList = useRef();
    useEffect(() => {
        fetch(`${URL.user}/message/${partner.username}`, {
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
        .then(res => res.json())
        .then(res => setMessages(res));
    }, [])
    useEffect(() => {
        socket.on('receiveMessageChild', (message) => {
            setMessages((prev) => {
                return [...prev, message];
            });
        });
        return () => {
            socket.off('receiveMessageChild');
        }
    }, []);

    useEffect(() => {
        messageList.current.scrollTop = messageList.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const handleFocus = () => {
            messageInputRef.current.addEventListener("keypress", handleEnter)
        }

        const handleFocusOut = () => {
            messageInputRef.current.removeEventListener("keypress", handleEnter)
        }

        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                sendMessage({content: messageInputRef.current.value});
            }
        }
        messageInputRef.current.addEventListener("focus", handleFocus);
        messageInputRef.current.addEventListener("focusout", handleFocusOut);

        return () => {
            if(messageInputRef.current) {
                messageInputRef.current.removeEventListener("focus", handleFocus);
                messageInputRef.current.removeEventListener("focusout", handleFocusOut);
            }
        }
    }, [])

    const sendMessage = (message) => {
        message.toSocketId = toSocketId;
        message.to = partner.username;
        message.from = user.username;
        socket.emit('sendMessage', message);
        messageInputRef.current.value = '';
        setMessages((prev) => {
            return [...prev, message];
        })
    }

    const handleClose = () => {
        dispatch(closeChat(partner));
    }

    return ( 
        <div className="message">
            <div className="title">
                <img className="avatar" src={partner.avatar} />
                <p className="name active">{partner.name}</p>
                <IoCloseSharp className="close" onClick={() => handleClose()} />
            </div>
            <ul className="message-list" ref={messageList}>
                {
                    messages.map((message, index) => {
                        return (
                            <li className={`message-item ${message.from == user.username ? 'me' : 'partner'}`} data-index={index} key={index}>
                                <p className="message-content" readOnly>{message.content} </p>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="message-input">
                <input className="input-area" ref={messageInputRef} type="text" placeholder="Nhập tin nhắn" />
                <button className="message-send" onClick={() => sendMessage({content: messageInputRef.current.value})}><IoSendSharp className="icon send-btn" /></button>
            </div>
        </div>
     );
}

export default memo(Message, (prev, next) => prev.partner === next.partner);