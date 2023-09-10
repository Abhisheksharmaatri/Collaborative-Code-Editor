import React, { useEffect, useState } from 'react'

import '../styles/Room.css'

import DeleteRoom from '../components/Room/DeleteRoom'
import EditRoom from '../components/Room/EditRoom'
import ShowRoom from '../components/Room/ShowRoom'
import AddUser from '../components/Room/AddUser'
import Users from '../components/Room/Users'

function Room (props) {
  const id = window.location.pathname.split('/')[3]
  console.log(id)

  const [room, setRoom] = useState({})
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [users, setUsers] = useState([])
  const [owner, setOwner] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`http://localhost:4000/room/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.success) {
            setRoom({ ...result.data })
            setUsers([...result.data.users])
            setOwner({ ...result.data.owner })
          } else {
            window.location.href = '/login'
          }
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  }, [id, isEditing])

  //Now adding the websockets
  useEffect(() => {
    props.socket.on('message', message => {
      setMessages([...messages, message])
    })
    props.socket.on('room-updated', room => {
      if (room._id === id) {
        setRoom(room)
      }
    })
  }, [messages])

  return (
    <div className='room-container'>
      <div className='code-container'>
        {isEditing ? (
          <EditRoom
            room={room}
            setRoom={setRoom}
            setIsEditing={setIsEditing}
            messages={messages}
            setMessages={setMessages}
            message={message}
            setMessage={setMessage}
          />
        ) : (
          <ShowRoom
            room={room}
            messages={messages}
            setMessages={setMessages}
            message={message}
            setMessage={setMessage}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
      <div className='room-actions'>
        <div className='room-buttons'>
          <div className='room-delete'>
            <DeleteRoom />
          </div>
          <div className='room-edit'>
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        <Users users={users} owner={owner} />
        <AddUser setMessage={setMessage} />
        <div className='room-messages'>
          <h3 className='room-messages-heading'>Messages</h3>
          <p>{message}</p>
          <ul className='room-messages-list'>
            {messages.map(message => (
              <li key={message._id} className='room-messages-list-item'>
                <div className='room-messages-list-item-id'>
                  <p>{message.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Room
