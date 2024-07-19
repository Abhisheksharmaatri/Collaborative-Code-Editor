import { useEffect } from 'react';
import { io } from 'socket.io-client'
import logo from './logo.svg';
import './App.css';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Room from './pages/Room';

import {backend} from './config';

import setupSocketListeners from './middleware/WebSockets';

//Set up the webscokets
// import socket from './middleware/WebSockets';
const socket = io(backend.url, {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: false,
});

function App() {
  //server pages based on the current url
  useEffect(() => {
    setupSocketListeners(socket);
  }, []);

  const url = window.location.href.split('/');
  if (url[3] === 'home') {
    return <div>
      <Home socket={socket} />
    </div>
  }else if(url[3] === 'signup'){
    return <div>
      <Signup socket={socket} />
      </div>
  }
  else if (url[3] === 'room') {
    return <div>
      <Room socket={socket} />
    </div>
  }
  else {
    return <div>
       <Login socket={socket} />
    </div>
  }
}

export default App;