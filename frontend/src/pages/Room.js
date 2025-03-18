import { useEffect, useState } from 'react';
import { backend, user} from '../config';

import CodeEditor from '../components/Room/CodeEditor';
import RoomUser from '../components/Room/RoomUser'; 
import Chat from '../components/Room/Chat';
import Output from '../components/Room/Output';
import Input from '../components/Room/Input';

import '../styles/Room.css';

function Room(props) {
    const [roomId, setRoomId] = useState(window.location.href.split('/')[4]);
    const [code, setCode] = useState('Fetching code...');
    const [language, setLanguage] = useState('python');
    const [input, setInput] = useState('');
    const [user, setUser] = useState({});
    const [output, setOutput] = useState('Please run the code to see the output');
    const [message, setMessage] = useState('Fetching room...');
    const [update, setUpdate] = useState(false);
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
    });
    const getRoom = () => {
        const url = backend.url+'/room/get/'+window.location.href.split('/')[4];
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
                console.log(data)
                if (data.success) {
                    console.log(data.data);
                    setRoom(data.data.room);
                    setCode(data.data.room.code);
                    setChat(data.data.room.chat);
                    setMessage('Room fetched successfully');
                    setUser(data.data.user);
                } else {
                    // window.location.href = '/login';
                    setMessage(data.message)
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
        const url=backend.url+'/room/update/'+room._id;
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
              setRoom({ ...room, code: code });
              setMessage(data.message);
          } else {
              // window.location.href = '/login';
              setMessage(data.message)
          }
        })
        .catch(error => { 
          setMessage(error.message);
          console.log('error')
        })
        console.log('Code saved:', code);
    };

    //RUN CODE
    const runCode = (code) => {
        setOutput('Running code...');
        const url = backend.url + '/code';
        fetch(url, {
            method: 'POST',
            headers: {
                'content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ code: code, language: language, input: input})
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data)
                if (data.success) {
                    console.log(data);
                    setMessage(data.message);
                    setOutput(data.output);
                } else {
                    // window.location.href = '/login';
                    setMessage(data.message)
                    setOutput(data.error)
                }
            })
            .catch(error => {
                setMessage(error.message);
                console.log('error')
            })
    }

    useEffect(() => { 
        getRoom();
        console.log(props.socket)
        props.socket.on('room-updated', (updatedRoom) => {
            console.log("room: ", roomId)
            if (updatedRoom._id !== roomId) return;
            console.log("updated room: ",updatedRoom)
            setCode(updatedRoom.code);
        });
        props.socket.on('chat-updated', (updatedChat) => {
            console.log("updated chat: ",updatedChat)
            setChat(updatedChat);
        });
        props.socket.on('user-added', (newUser) => {
            console.log("new user: ", newUser);
            if (roomId === newUser.roomId) {
                console.log("yes, this is the room");
        
                setRoom((prevRoom) => {
                    // Check if the user already exists in the room
                    const userExists = prevRoom.users.some(user => user.email === newUser.user.email);
                    
                    if (!userExists) {
                        return {
                            ...prevRoom,
                            users: [...prevRoom.users, newUser.user]
                        };
                    }
        
                    return prevRoom; // Return unchanged if user already exists
                });
            }
        });
        props.socket.on('user-removed', (removedUser) => {
            console.log("removed user: ", removedUser);
            if (removedUser.roomId === roomId) {
                console.log("yes, this is the room");
        
                setRoom((prevRoom) => {
                    // Check if the user exists in the list before attempting to remove
                    const userExists = prevRoom.users.some(user => user.email === removedUser.user.email);
        
                    if (userExists) {
                        return {
                            ...prevRoom,
                            users: prevRoom.users.filter(user => user.email !== removedUser.user.email)
                        };
                    }
        
                    return prevRoom; // Return unchanged if user does not exist
                });
            }
        });
        props.socket.on('room-deleted', (room) => {
            if (room.id === roomId) {
                setMessage('Room deleted');
                window.location.href = '/home';
            }
        })
    },[]);
    return (
        <div className="room__container">
            <div className='room__info'>
                <h1>Room: {room.name}</h1>
                <p>({room.description})</p>
                <p>{message}</p>
            </div>
            <div className='code__info'>
                <CodeEditor code={code} roomId={room._id} save={saveRoom} setMessage={setMessage} socket={props.socket} runCode={runCode} setLanguage={setLanguage} />
                <div className='io__container'>
                    <Input input={input} setInput={setInput} />
                    <Output output={output} />
                </div>
            </div>
            <div className="network__container">
                <Chat chat={chat} setChat={setChat}  roomId={room._id} setMessage={setMessage} getRoom={getRoom} socket={props.socket} />
                <RoomUser users={room.users} roomId={room._id} setMessage={setMessage} owner={room.owner} />
            </div>
        </div>
    )
}

// Room();

export default Room;

