import { react, useState } from 'react';
import { user, room, backend } from '../../config';

const CreateRoom = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [message, setMessage] = useState('');

    const validateName = () => {
        if (name.length < room.name.length) {
            setNameError('Name must be at least ' + room.name.length + ' characters long.');
            setMessage('Name Incorrect');
            return false;
        } else {
            setNameError('');
            return true;
        }
    };

    const validateDescription = () => {
        if (description.length < room.description.length) {
            setDescriptionError('Description must be at least ' + room.description.length + ' characters long.');
            setMessage('Description Incorrect');
            return false;
        } else {
            setDescriptionError('');
            return true;
        }
    };

    const handleCreateRoom = async (e) => {
        const isNameValid = validateName();
        const isDescriptionValid = validateDescription();

        if (isNameValid && isDescriptionValid) {
            const requestBody = {
                name: name,
                description: description
            };

            try {
                const response = await fetch(backend.url + '/room/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();

                if (data.success) {
                    setName('');
                    setDescription('');
                    setMessage('');
                    // window.location.href = '/room/' + data.data._id;
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                setMessage(error.message);
                console.log(error);
            }
        }
    };

    return (
        <div className='create__room__container'>
            <h1>Create Room</h1>
            <div>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' className='form-control' id='name' placeholder='Enter name' value={name} onChange={e => setName(e.target.value)} />
                    <small className='form-text text-muted'>{nameError}</small>
                </div>
                <div className='form-group'>
                    <label htmlFor='description'>Description</label>
                    <input type='text' className='form-control' id='description' placeholder='Enter description' value={description} onChange={e => setDescription(e.target.value)} />
                    <small className='form-text text-muted'>{descriptionError}</small>
                </div>
                <button className='btn btn-primary' onClick={handleCreateRoom}>Create</button>
                <small className='form-text text-muted'>{message}</small>
            </div>
        </div>
    );
};

export default CreateRoom;
