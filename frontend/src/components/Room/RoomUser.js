import { react, useEffect, useState } from 'react';
import { backend } from '../../config';

const RoomUser = (props) => {
    const [users, setUsers] = useState(props.users);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [message, setMessage] = useState('');
    const [newUserEmailError, setNewUserEmailError] = useState('Email address should be properly formatted.');

    const checkEmail = () => {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserEmail);
        if (!emailValid) {
            setNewUserEmailError('Invalid email address.');
            setMessage('Email Incorrect');
            return false;
        } else {
            setNewUserEmailError('');
            return true;
        }
    };

    const handleAddUser = () => { 
        const isEmailValid = checkEmail();
        if (isEmailValid) {
            const requestBody = {
                email: newUserEmail
            };
            const url = backend.url + '/room/add-user/' + props.roomId;
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setMessage('User added');
                        setNewUserEmail('');
                        // update the users list here
                        setUsers([...users, data.user]);

                    } else {
                        setMessage('Error while adding user: ' + data.message);
                    }
                })
                .catch(error => {
                    setMessage(error.message);
                    console.log('error');
                });
        }
    };

    const handleRemoveUser = (email) => {
        const requestBody = {
            email: email
        };
        const url = backend.url + '/room/remove-user/' + props.roomId;
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMessage('User removed');
                    // update the users list here
                    setUsers(users.filter(user => user.email !== email));
                } else {
                    setMessage('Error while removing user: ' + data.message);
                }
            })
            .catch(error => {
                setMessage(error.message);
                console.log('error');
            });
    };

    useEffect(() => {
        setUsers(props.users);
    }, [props.users]);

    return (
        <div className="room__user">
            <h3>Users:</h3>
            {users.length === 0 ? (
                <div className="user__list">
                    <div className="user__container">
                        <b>{props.owner.name}</b>
                        <button className="btn btn-primary">Owner</button>
                    </div>
                </div>
            ) : (
                <div className="user-list">
                    <div className="user">
                        <b>{props.owner.name}</b>
                        <button className="btn btn-primary">Owner</button>
                    </div>
                    {users.map((user, index) => (
                        <div key={index} className="user">
                            <b>{user.name}</b>
                            <button onClick={() => handleRemoveUser(user.email)} className="btn btn-danger">Remove</button>
                        </div>
                    ))}
                </div>
            )}
            <div className='user__input'>
                <input
                    type="text"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder='Add User With Email'
                />
                <button onClick={handleAddUser} className="btn btn-primary">Add User</button>
            </div>
            {newUserEmailError && <p>{newUserEmailError}</p>}
            <p>{message}</p>
        </div>
    );
};

export default RoomUser;
