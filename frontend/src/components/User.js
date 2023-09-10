import React, { useState, useEffect } from 'react'
import '../styles/Signup.css'

import CreateRoom from './CreateRoom'

function User () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rooms, setRooms] = useState([])

  const [data, setData] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
    }
    if (token) {
      fetch('http://localhost:4000/user/get-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            window.location.href = '/login'
            throw new Error('Network response was not ok')
          }
          // If the response is JSON, use .json()
          if (
            response.headers.get('content-type').includes('application/json')
          ) {
            return response.json()
          } else {
            // If the response is plain text, use .text()
            return response.text()
          }
        })
        .then(result => {
          if (result.success) {
            setData(result.data)
          } else {
            window.location.href = '/login'
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  }, [])

  return (
    <div className='User-container'>
      <div className='user-data'>
        <div className='user-data-avatar'>
          <h3 className='User-heading'>User</h3>
          <p className='user-data-name'>Name:{data.name}</p>
          <p className='user-data-email'>Email: {data.email}</p>
        </div>
        <CreateRoom />
      </div>
      <div className='user-rooms-container'>
        <h3 className='user-rooms-heading'>Rooms:</h3>
        {data.room === undefined || data.room.length === 0 ? (
          <p className='user-rooms-message'>No active rooms</p>
        ) : (
          <ul className='user-rooms-list'>
            {data.room.map(room => (
              <li key={room._id} className='user-rooms-list-item'>
                <div className='user-rooms-list-item-id'>
                  <a href={`/room/get/${room.id._id}`}>Room: {room.id.name}</a>
                  <p>Role: {room.role}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <div className='user-messages-container'>
        <h3 className='user-messages-heading'>Messages:</h3>
        {data.message === undefined || data.message.length === 0 ? (
          <p className='user-messages-message'>No messages</p>
        ) : (
          <ul className='user-messages-list'>
            {data.message.map(message => (
              <li key={message._id} className='user-messages-list-item'>
                <div className='user-messages-list-item-id'>
                  <p>Room: {message.room}</p>
                  <p>Message: {message.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  )
}

export default User
