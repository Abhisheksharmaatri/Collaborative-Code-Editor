import { react, useEffect, useState } from 'react';
import { backend, room } from '../config';
import CodeEditor from '../components/Room/CodeEditor';
import RoomUser from '../components/Room/RoomUser'; 
import Chat from '../components/Room/Chat';

import '../styles/Room.css';

function Room(props) {
    const [code, setCode] = useState('Fetching code...');
    const [chat, setChat] = useState([
        {
            sender: {
                email: 'fetching',
                name: 'fetching',
                _id: 'fetching'
            },
            comment: 'fetching',
            _id: 'fetching'
        }
    ]);
    const [room, setRoom] = useState({
        name: 'fetching',
        description: 'fetching',
        code: 'fetching',
        owner: {
            email: 'fetching',
            name: 'fetching',
            _id: 'fetching'
        },
        chat: [{
            sender: {
                email: 'fetching',
                name: 'fetching',
                _id: 'fetching'
            },
            comment: 'fetching',
            _id: 'fetching'
        }],
        users: [{
            email: 'fetching',
            name: 'fetching',
            _id: 'fetching'
        }],
        requests:[]
    })
    const [message, setMessage] = useState('Fetching room...')
    const getRoom = () => {
        const url = backend.url+'room/get/'+window.location.href.split('/')[4];
        fetch(url, {
            method: 'GET',
            headers: {
                'content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setRoom(data.data);
                    setCode(data.data.code);
                    setChat(data.data.chat);
                    setMessage('');
                } else {
                    // window.location.href = '/login';
                }
            })
            .catch(error => { 
                setMessage(error.message);
                console.log('error')
        })
    }

    
    const saveRoom = (code) => {
        // Your save logic here
        const reqesutBody = {
            name: room.name,
            description: room.description,
            code: code,
            chat:chat
        }
        const url=backend.url+'room/update/'+room._id;
        fetch(url, {
          method: 'PUT',
          headers: {
            'content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
            },
          body: JSON.stringify(reqesutBody)
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.success) {
              setRoom({...room, code:code});
          } else {
            // window.location.href = '/login';
          }
        })
        .catch(error => { 
          setMessage(error.message);
          console.log('error')
        })
        console.log('Code saved:', code);
    };
    useEffect(() => { 
        getRoom();
        console.log(props.socket)
        props.socket.on('room-updated', (updatedRoom) => {
            console.log("ipdated room: ",updatedRoom)
            setCode(updatedRoom.code);
        });
        props.socket.on('chat-updated', (updatedChat) => {
            console.log("ipdated chat: ",updatedChat)
            setChat(updatedChat);
        });
    },[props.socket]);
    return (
        <div className="Room">
            <div className='room__info'><h1>Room: {room.name}</h1>({room.description})</div>
            <CodeEditor code={code} roomId={room._id} save={saveRoom} setMessage={setMessage} socket={props.socket} />
            <div className="room__container">
                <Chat chat={chat} setChat={setChat}  roomId={room._id} setMessage={setMessage} getRoom={getRoom} socket={props.socket} />
                <RoomUser users={room.users} roomId={room._id} setMessage={setMessage} owner={room.owner} />
            </div>
        </div>
    )
}

// Room();

export default Room;

