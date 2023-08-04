import './Contacts.scss';
import { Message } from '../';
import { useState, useEffect, useRef } from 'react'
import { URL } from '../../common/constants/constant';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { openChat } from '../../common/redux/actions/action';

function Contacts() {
    const user = useSelector(state => state.user);
    const getContactsInfo = async () => {
        return await fetch(`${URL.user}/contacts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
        .then(res => res.json())
        // .then(res => { 
        //     return res;
        // })
    }

    const {data, isLoading, refetch} = useQuery('getContactsInfo', getContactsInfo, {
        refetchOnWindowFocus: false,
        cacheTime: 1000 * 60 * 60 * 24,
    });

    const socket = useSelector(state => state.user.socket);
    const action = useSelector(state => state.action);
    const refresh = useRef();
    const [contacts, setContacts] = useState([]);
    const [partner, setPartner] = useState(action.closeChat);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            setContacts(data);
        }
    }, [data]);

    const popupMessage = ((item) => {
        dispatch(openChat(item));
        setPartner(item);
    })

    useEffect(() => {
        socket.emit('sendOnlineList', user.username);
        refresh.current = setInterval(() => {
            socket.emit('sendOnlineList', user.username);
        }, 5000);
        return () => {
            clearInterval(refresh.current);
        }
    }, [JSON.stringify(contacts)]);

    useEffect(() => {
        socket.on('receiveOnlineList', (data) => {
            setContacts((prev) => {
                prev.forEach((item) => {
                    const exist = data.findIndex(contact => contact.username == item.username);
                    if (exist != -1) {
                        item.online = true;
                        item.socketId = data[exist].socketId;
                    } else {
                        item.online = false;
                    }
                })
                return [...prev];
            })
        })
        return () => {
            socket.off('receiveOnlineList');
        }
    }, [])

    useEffect(() => {
        if (contacts.length != 0) {
            socket.on('receiveMessage', (data) => {
                contacts.forEach(contact => {
                    if (contact.username === data.from && partner != contact) {
                        popupMessage(contact);
                    }
                })
            })
        }
        return () => {
            socket.off('receiveMessage');
        }
    }, [JSON.stringify(contacts)]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return ( 
        <div className="contacts">
            <h3>Contacts</h3>
            <ul className="contacts-list">
                {
                    contacts.map((item, index) => {
                        return (
                            <li className="contact-item" key={index} onClick={() => popupMessage(item)}>
                                <img className={item.online ? 'avatar active' : 'avatar inactive'} src={item.avatar} alt="avatar" />
                                <p>{item.name}</p>
                            </li>
                        )
                    })
                }
            </ul>

            {action.closeChat != partner && <Message partner = {partner} />}
        </div>
    );
}

export default Contacts;