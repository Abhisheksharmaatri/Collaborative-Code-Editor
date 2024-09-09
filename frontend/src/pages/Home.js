import {  useEffect, useState } from 'react';
import { backend } from '../config';
import RoomList from '../components/Home/RoomList';
import CreateRoom from '../components/Home/CreateRoom';
import DeveloperContact from '../components/divs/DeveloperContact';

import '../styles/Home.css'

function Home(props) {
    const [user, setUser] = useState({
        name: 'fetching',
        email: 'fetching',
        room: [{
            _id:1,id:{
            name: 'fetching',
            description: 'fetching'}
        }]
    })
    const [message, setMessage] = useState('Fetching user...')

    const getUser = () => {
        const url = backend.url + '/user/get-user';
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        } else {
            fetch(url, {
                method: 'GET',
                headers: {
                    'content-Type': 'application/json',
                    'authorization': token
                }
            })
                .then(response => {
                return response.json();
            })
                .then(data => {
                if (data.success) {
                    setUser(data.data);
                    setMessage('');
                } else {
                    window.location.href = '/login';
                }
            })
            .catch(error => {
                setMessage(error.message);
                console.log('error')
            })
         }
    };

    //Now for the first we do is run the get user function
    //what si that funcion that get executed when the first time a componenbt is loaded
    useEffect(() => {
        getUser();
    
        // Assuming 'socket' is passed as a prop
        const { socket } = props;
    
        // Subscribe to the 'room-created' event
        socket.on('room-created', (newRoom) => {
          setUser((prevUser) => ({
            ...prevUser,
              room: [...prevUser.room, {
                  _id: newRoom.id, id: {
                      name: newRoom.name,
                      description:newRoom.description
            }}],
          }));
            setMessage('Room Created');
        });

        socket.on('room-deleted', (delRoom) => {
            setUser((prevUser) => ({
                ...prevUser,
                room: prevUser.room.filter((room) => {
                    return room._id !== delRoom.id;
                }),
            }));
            setMessage('Room Deleted');
        })
    
        // Unsubscribe from the event when the component is unmounted
        return () => {
        //   socket.off('room-created');
        //   socket.off('room-deleted');
        };
      }, [props,message]);
    

    return (
        <div className="home">
            <div className='home__header'>
                <div className='actions'>
                    <div className='user-info'>
                    <h1>{user.name}</h1>
                    <h3>{user.email}</h3>
                </div>
                    <DeveloperContact />
                </div>
                <CreateRoom />
            </div>
            <div className='room__list__container'>
                <h1>Rooms: </h1>
                <RoomList rooms={user.room} />
                <div className='message'>
                    {message}
                </div>
            </div>
        </div>

    )
}
export default Home;