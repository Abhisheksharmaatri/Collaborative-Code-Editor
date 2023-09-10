import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  redirect
} from 'react-router-dom'

import './styles/App.css'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Room from './pages/Room'
import Error from './pages/Error'

//Socket.io
import { io } from 'socket.io-client'
const socket = io('http://localhost:4000')

function App () {
  const token = localStorage.getItem('token')

  socket.on('connect', () => {
    console.log('Connected to server')
  })

  socket.on('message', message => {
    console.log(message)
  })

  function path () {
    const path = window.location.pathname
    if (path === '/') {
      return <Home />
    }
    if (path === '/login') {
      return <Login />
    }
    if (path === '/signup') {
      return <Signup />
    }
    if (path === '/home') {
      return <Home />
    }
    //For a params based route
    if (path.includes('/room/')) {
      return <Room socket={socket} />
    } else {
      return <Error />
    }
  }
  return <div className='App'>{path()}</div>
}

export default App
