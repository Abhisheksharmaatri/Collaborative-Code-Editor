import { useEffect, useState} from 'react';
import { io } from 'socket.io-client'
import './App.css';


import NavBar from './components/divs/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Room from './pages/Room';

import {backend} from './config';

import setupSocketListeners from './middleware/WebSockets';

//Set up the webscokets
// import socket from './middleware/WebSockets';
const socket = io(backend.url);

function App() {
  //server pages based on the current url
  //For dark Mode
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setupSocketListeners(socket);
  }, [darkMode]);

  const url = window.location.href.split('/');
  if (url[3] === 'home') {
    return <div className='root'>
      <NavBar darkMode={ darkMode} setDarkMode={setDarkMode}/>
      <Home socket={socket} darkMode={ darkMode} />
    </div>
  }else if(url[3] === 'signup'){
    return <div className='root'>
      <NavBar darkMode={ darkMode} setDarkMode={setDarkMode}/>
      <Signup socket={socket} darkMode={ darkMode}/>
      </div>
  }
  else if (url[3] === 'room') {
    return <div className='root'>
      <NavBar darkMode={ darkMode} setDarkMode={setDarkMode}/>
      <Room socket={socket} darkMode={ darkMode}/>
    </div>
  }
  else {
    return <div className='root'>
      <NavBar darkMode={ darkMode} setDarkMode={setDarkMode}/>
       <Login socket={socket} darkMode={ darkMode}/>
    </div>
  }
}

export default App;
