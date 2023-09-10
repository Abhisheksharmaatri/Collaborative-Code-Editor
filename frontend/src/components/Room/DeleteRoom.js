import React, { useState, useEffect } from 'react'

function DeleteRoom () {
  const [message, setMessage] = useState('')
  function deleteRoom (e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const id = window.location.pathname.split('/')[3]
    const request = new Request(`http://localhost:4000/room/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    fetch(request)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        // If the response is JSON, use .json()
        if (response.headers.get('content-type').includes('application/json')) {
          return response.json()
        } else {
          // If the response is plain text, use .text()
          return response.text()
        }
      })
      .then(data => {
        if (data.success) {
          window.location.href = '/home'
        } else {
          setMessage(data.message)
          console.log('Error deleting room:', data.message)
        }
      })
  }
  return (
    <div className='delete-room-container'>
      <button className='delete-room-button' onClick={deleteRoom}>
        Delete Room
      </button>
    </div>
  )
}

export default DeleteRoom
