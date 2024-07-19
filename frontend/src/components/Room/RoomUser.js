import { react, useEffect, useState } from 'react';
import {backend} from '../../config'
const RoomUser = (props) => {
    const [users, setUsers] = useState(props.users);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserEmailError, setNewUserEmailError] = useState('Email address should be properly formatted.');

    const checkEmail = () => {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserEmail)
        if (!emailValid) {
            setNewUserEmailError('Invalid email address.')
            props.setMessage('Email Incorrect')
        } else {
            setNewUserEmailError('')
        }
    }

    const handleAddUser = () => { 
        checkEmail()
        if (newUserEmailError === '') {
            const requestBody = {
                email: newUserEmail
            }
            const url = backend.url + 'room/add-user/' + props.roomId;
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify(requestBody),
                headers: {
                    'content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    if (data.success) {
                        props.setMessage('User added');
                    } else {
                        // window.location.href = '/login';
                    }
                })
                .catch(error => {
                    props.setMessage(error.message);
                    console.log('error')
                
            })
        }
    }
    const handleRemoveuser = (email) => {
        const requestBody = {
            email: email
        }
        console.log(props.roomId)
        const url = backend.url + 'room/remove-user/' + props.roomId;
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                'content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data)
                if (data.success) {
                    props.setMessage('User removed');

                } else {
                    // window.location.href = '/login';
                }
            })
            .catch(error => {
                props.setMessage(error.message);
                console.log('error')
            
        })  
    }
    useEffect(() => {
        setUsers(props.users);
    }, [props.users]);
    return (
        <div className="room__user">
            <h3>Users:</h3>
            {users.length === 0 ? <p>No users</p> :
                <div className="user-list">
                    <div className="user">
                        <b>{props.owner.name}</b>
                        <button className="btn btn-primary">Owner</button>
                    </div>
                {users.map((user, index) => {
                    return <div key={index} className="user">
                        <b>{user.name}</b>
                        <button onClick={() => handleRemoveuser(user.email)} className="btn btn-danger">Remove</button>
                    </div>
                })}
            </div>}
            <div className='user-input'>
                <input type="text" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
                <button onClick={handleAddUser} className="btn btn-primary">Add user with email</button>
            </div>
        </div>
    );
 };

export default RoomUser;