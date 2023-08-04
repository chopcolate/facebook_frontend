import { useQuery } from 'react-query';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Input, Button } from '@mui/material';
import { IoImage, IoSendSharp } from 'react-icons/io5';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { RiLiveFill } from 'react-icons/ri';
import { Post } from '../../features';
import './Home.scss';
import { URL } from '../../common/constants/constant';

function Home() {
    const user = useSelector(state => state.user);
    const uploadRef = useRef();

    const [preview, setPreview] = useState("");

    const uploadImage = (e) => {
        const url = global.URL.createObjectURL(e.target.files[0])
        setPreview(url);
    }

    const getPosts = async () => {
        return await fetch(URL.user, {
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })                            
        .then(res => res.json())
        // .then(data => {
        //     return data;
        // })
    }

    const {data, isLoading, refetch} = useQuery('posts_api', getPosts, {
        refetchOnWindowFocus: false,
    });
    const [posts, setPosts] = useState([]);
    const postInputRef = useRef();

    const setPost = async (content) => {
        const post = new FormData();
        post.append("author", user.username)
        post.append("time", new Date())
        post.append("image", uploadRef.current.files[0])
        post.append("text", content.text)
        await fetch(URL.user + '/create-post', {
            method: 'POST',
            body: post,
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
            }
        })
        .then((res) => {
            postInputRef.current.value = '';
            uploadRef.current.value = "";
            setPreview("");
            refetch();
        })

    }


    useEffect(() => {
        if (data) {
            setPosts(data);
        }
    }, [data]);

    if (isLoading) {
        return <div className="content">Loading...</div>
    }

    return ( 
        <div className="content">
            <div className="status">
                <div className="input-area">
                    <div className="post-content">
                        <Input inputRef={postInputRef} className="input" placeholder="What's on your mind ?" multiline disableUnderline={true} />
                        <img className="image" src={preview}/>
                    </div>

                    <button className="post" onClick={() => setPost({text: postInputRef.current.value, img: uploadRef.current.files[0]})}><IoSendSharp className="icon post-btn" /></button>
                </div>
                
                <div className="status-actions">
                    <div className="status-action">
                        <RiLiveFill className="icon" />
                        <p>Live Stream</p>
                    </div>
                    <div className="status-action">
                        <label htmlFor="contained-button-file">
                            <input accept="image/*" ref={uploadRef} style={{ display: "none" }} id="contained-button-file" type="file" onChange={(e) => uploadImage(e)} />
                            <Button component="span" sx={{color: 'black', textTransform: 'none'}}>
                                <IoImage className="icon" /> 
                                Photo/Video
                            </Button>
                        </label>
                    </div>
                    <div className="status-action">
                        <HiOutlineEmojiHappy className="icon" /> 
                        <p>Feeling/Acticity</p>
                    </div>
                </div>
            </div>

            <Post postList = {posts} />

        </div>
     );
}

export default Home;