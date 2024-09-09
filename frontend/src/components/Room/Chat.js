import React, { useEffect, useState, useRef } from 'react';
import { backend } from '../../config';
import '../../styles/Chat.css';

const Chat = (props) => {
    const [comment, setComment] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        const handleCommentAdded = (newComment) => {
            if(newComment.id===props.roomId){console.log("new chat: ", newComment);
            props.setChat([...props.chat, newComment]);
            requestAnimationFrame(() => {
                scrollToBottom();
            });}
        };

        props.socket.on('comment-added', handleCommentAdded);

        return () => {
            props.socket.off('comment-added', handleCommentAdded);
        };
    }, [props.socket, props.chat, props.setChat]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        if (comment.length > 0) {
            const url = backend.url + '/room/comment/add/' + props.roomId;
            const requestBody = {
                comment: comment
            };
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add comment');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.success) {
                    setComment('');
                    props.setMessage('Comment added');
                } else {
                    props.setMessage('Failed to add comment');
                }
            })
            .catch(error => {
                props.setMessage(error.message);
                console.error('Error adding comment:', error);
            });
        }
    };

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    return (
        <div className="chat__container">
            <h3>Chat</h3>
            <div className="chat__messages">
                {props.chat.map((comment, index) => (
                    <div className="chat__message" key={index}>
                        <b>{comment.sender.name}:</b> {comment.comment}
                    </div>
                ))}
                <div ref={chatEndRef}></div> {/* This ensures scrolling to bottom */}
            </div>
            <h3>Comment</h3>
            <div className="chat__input">
                <input type="text" value={comment} onChange={handleCommentChange} placeholder="Enter your comment" />
                <button onClick={handleCommentSubmit} className="btn btn-primary">Send</button>
            </div>
        </div>
    );
};

export default Chat;
