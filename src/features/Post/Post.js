import { Input } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { BsSuitHeartFill, BsSuitHeart } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { RiShareForwardLine } from 'react-icons/ri';
import { URL } from '../../common/constants/constant';
import moment from 'moment';
import './Post.scss';

function Post( {postList = []} ) {
    const user = useSelector(state => state.user);
    const [posts, setPosts] = useState(postList);
    useEffect(() => {
        setPosts(postList);
    }, [postList])
    const postRef = useRef([]);
    const handleLove = (post, index) => {
        const data = {
            postId: posts[index]._id,
            loved: posts[index].loves.includes(user.username) ? false : true,
        }
        fetch(URL.user + '/love-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`,
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            setPosts((prev) => {
                const newPosts = [...prev];
                newPosts[index].loves.includes(user.username) ? newPosts[index].loves.splice(newPosts[index].loves.indexOf(user.username), 1) : newPosts[index].loves.push(user.username);
                return newPosts;
            })
        })
    }
    const handleSendCmt = (post, index) => {
        const cmt = (post.childNodes[3].childNodes[1].childNodes[0].childNodes[0].value);
        const data = {
            postId: posts[index]._id,
            comment: cmt
        }
        fetch(`${URL.user}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`,
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            post.childNodes[3].childNodes[1].childNodes[0].childNodes[0].value = '';
            setPosts((prev) => {
                const newPosts = [...prev];
                newPosts[index].comments.push({
                    avatar: user.avatar,
                    content: cmt,
                    name: user.name,
                    username: user.username,
                })
                return newPosts;
            })
        })
    }
    return (
        <>
            <ul className="posts-list">
                {
                    posts.map((post, index) => {
                        return (
                            <li className="post-item" key={index} ref={ref => postRef.current.push(ref)}>
                                <div className="post-info">
                                    <img src={post.avatar} alt="avatar" className="avatar" />
                                    <div className="info">
                                        <p className="name">{post.author}</p>
                                        <p className="time">{moment(post.time).format("hh:mm A, MMM-DD-YYYY")}</p>
                                    </div>
                                </div>
                                <div className="post-content">
                                    <p className="post-text">{post.content.text}</p>
                                    {post.content.img ? post.content.img.length > 0 && <img src={post.content.img} alt="post-img" className="post-img" /> : null}
                                </div>
                                <div className="post-action">
                                    <div className="action like" onClick={() => handleLove(post, index)}>
                                        {!post.loves.includes(user.username) && <BsSuitHeart className="icon"/>}
                                        {post.loves.includes(user.username) && <BsSuitHeartFill className="icon loved"/>}
                                        <p className="text">Love</p>
                                    </div>

                                    <div className="action comment">
                                        <GoComment className="icon"/>
                                        <p className="text">Comment</p>
                                    </div>

                                    <div className="action share">
                                        <RiShareForwardLine className="icon"/>
                                        <p className="text">Share</p>
                                    </div>
                                </div>
                                <div className="post-comments">
                                    <ul className="comment-list">
                                        {post.comments.map((comment, index) => {
                                            return (
                                                <li className="post-comment" key={index}>
                                                    <img className="comment-avatar" src={comment.avatar} />
                                                    <div className="comment-content">
                                                        <p className="name">{comment.name}</p>
                                                        <p className="text">{comment.content}</p>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <div className="comment-input">
                                        <Input multiline placeholder="Write a comment..." disableUnderline={true} sx={{ width: "95%",
                                                                                                                        height: "40px",
                                                                                                                        borderRadius: "8px",
                                                                                                                        border: "1px solid #ccc",
                                                                                                                        padding: "0 12px",
                                                                                                                        fontSize: "16px",
                                                                                                                        outline: "none"}} />
                                        <button className="send-cmt" onClick={() => handleSendCmt(postRef.current[index], index)}><AiOutlineSend /></button>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    );
}

export default Post;