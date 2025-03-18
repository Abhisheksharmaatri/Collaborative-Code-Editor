import {  useEffect, useState, useRef } from 'react';
import { backend } from '../config';
import RoomList from '../components/Home/RoomList';
import CreateRoom from '../components/Home/CreateRoom';
import DeveloperContact from '../components/divs/DeveloperContact';

import '../styles/Home.css'

// function Home(props) {
//     const [user, setUser] = useState({
//         name: 'fetching',
//         email: 'fetching',
//         room: [{
//             _id: 1,
//             id: {
//             name: 'fetching',
//             description: 'fetching'}
//         }]
//     })
//     const [message, setMessage] = useState('Fetching user...')

//     const getUser = () => {
//         const url = backend.url + '/user/get-user';
//         const token = localStorage.getItem('token');
//         if (!token) {
//             window.location.href = '/login';
//         } else {
//             fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     'content-Type': 'application/json',
//                     'authorization': token
//                 }
//             })
//                 .then(response => {
//                 return response.json();
//             })
//                 .then(data => {
//                 if (data.success) {
//                     setUser(data.data);
//                     setMessage('');
//                 } else {
//                     window.location.href = '/login';
//                 }
//             })
//             .catch(error => {
//                 setMessage(error.message);
//                 console.log('error')
//             })
//          }
//     };

//     //Now for the first we do is run the get user function
//     //what si that funcion that get executed when the first time a componenbt is loaded
//     useEffect(() => {
//         getUser();
//         console.log(user)
    
//         // Assuming 'socket' is passed as a prop
//         const { socket } = props;
    
//         // Subscribe to the 'room-created' event
//         socket.on('room-created', (newRoom) => {
//           setUser((prevUser) => ({
//             ...prevUser,
//               room: [...prevUser.room, {
//                   _id: newRoom.id, id: {
//                       name: newRoom.name,
//                       description:newRoom.description
//             }}],
//           }));
//             setMessage('Room Created');
//         });

//         socket.on('room-deleted', (delRoom) => {
//             setUser((prevUser) => ({
//                 ...prevUser,
//                 room: prevUser.room.filter((room) => {
//                     return room._id !== delRoom.id;
//                 }),
//             }));
//             setMessage('Room Deleted');
//         })

//         socket.on('user-added', (newUser) => {
//             console.log('user-added', newUser);
//             console.log(user.email);
//             console.log(newUser.user.email);
//             if (newUser.user.email === user.email) {
//                 console.log("update here")
//                 //add the this room to the user room list if it does not exists in their
//                 if (user.room.filter((room) => room._id === newUser.room.id).length === 0) {
//                     user.room.push(newUser.room);
//                 }
//                 setMessage('User Added');
//             }
//         });

//         socket.on('user-removed', (delUser) => {
//             console.log('user-removed', delUser);
//             console.log("user email for room remvoed", user.email);
//             if (delUser.user.email === user.email) {
//                 //remove the room from the user room list
//                 if (user.room.filter((room) => room._id === delUser.room.id).length > 0) {
//                     user.room = user.room.filter((room) => room._id !== delUser.room.id);
//                 }
//                 setMessage('User Removed');
//             }
//         })
    
//         // Unsubscribe from the event when the component is unmounted
//         return () => {
//           socket.off('room-created');
//           socket.off('room-deleted');
//         };
//       }, []);
    

//     return (
//         <div className="home">
//             <div className='home__data'>
//                 <div className='user-info'>
//                 <h1>Hi, Welcome {user.name}</h1>
//                     <h3>{user.email}</h3>
//                 </div>
//                 <CreateRoom />
//             </div>
//             <div className='room__list__container'>
//                 <h1>Rooms: </h1>
//                 <RoomList rooms={user.room} />
//                 <div className='message'>
//                     {message}
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Home;

function Home(props) {
    const [user, setUser] = useState({
        name: 'fetching',
        email: 'fetching',
        room: [{ _id: 1, id: { name: 'fetching', description: 'fetching' } }]
    });
    const [message, setMessage] = useState('Fetching user...');
    const [update, setUpdate] = useState(false);
    
    const userRef = useRef(user); // Store latest user state in ref

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
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.data);
                        userRef.current = data.data; // Update ref with latest user
                        setMessage('');
                    } else {
                        window.location.href = '/login';
                    }
                })
                .catch(error => {
                    setMessage(error.message);
                    console.log('error');
                });
        }
    };

    useEffect(() => {
        getUser();
        console.log(user);

        const { socket } = props;

        socket.on('room-created', (newRoom) => {
            setUser((prevUser) => {
                const updatedUser = {
                    ...prevUser,
                    room: [...prevUser.room, { _id: newRoom.id, id: { name: newRoom.name, description: newRoom.description } }]
                };
                userRef.current = updatedUser; // Update ref with new state
                return updatedUser;
            });
            setMessage('Room Created');
        });

        socket.on('user-added', (newUser) => { 
            if (newUser.user.email === userRef.current.email) {
                setUpdate(!update); // Trigger re-render
            }
        });

        socket.on('user-removed', (delUser) => {
            if (delUser.user.email === userRef.current.email) { 
                setUpdate(!update); // Trigger re-render
            }
        });

        return () => {
            socket.off('room-created');
            socket.off('user-added');
            socket.off('user-removed');
        };
    }, [update]); // No 'user' in dependencies to prevent infinite re-renders

    return (
        <div className="home">
            <div className='home__data'>
                <div className='user-info'>
                    <h1>Hi, Welcome {user.name}</h1>
                    <h3>{user.email}</h3>
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
    );
}
export default Home;
